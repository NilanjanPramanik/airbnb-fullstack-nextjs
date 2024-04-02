import { SafeUser } from "@/app/types"
import { useRouter } from "next/navigation"
import useLoginModal from "./useLoginModal"
import { useCallback, useMemo } from "react"
import axios from "axios"
import toast from "react-hot-toast"

interface useFavouriteHooks {
  listingId: string
  currentUser?: SafeUser | null
}

const useFavourite = ({
  listingId,
  currentUser
}: useFavouriteHooks) => {
  const router = useRouter();
  const loginModal = useLoginModal();

  const hasFavourited = useMemo(() => {
    const list = currentUser?.favouriteIds || [];

    return list.includes(listingId);
  }, [currentUser, listingId]);

  const toggleFavourite = useCallback( async (
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    e.stopPropagation();

    console.log(currentUser)
    if (!currentUser) {
      return loginModal.onOpen();
    }

    try {
      let request;

      if (hasFavourited) {
        request = () => axios.put(`/api/favourites/${listingId}`, {
          listingId
        })
      } else {
        request = () => axios.patch(`/api/favourites/${listingId}`, {
          listingId
        })
      }

      await request();
      router.refresh();
      toast.success("Success");
    } catch (error) {
      toast.error("Something wrong!")
    }
  }, [currentUser, loginModal, hasFavourited, listingId, router]);

  return { hasFavourited, toggleFavourite }
}

export default useFavourite;