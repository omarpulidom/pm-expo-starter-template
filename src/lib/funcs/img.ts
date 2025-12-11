import { Constants } from '../Constants'

export function getImageUrlOrDefault(
  imageUrl: string | null | undefined,
  opts?: {
    width: number
    height: number
  },
) {
  const _opts = opts || {
    width: 150,
    height: 150,
  }
  return imageUrl
    ? `${Constants.S3_BUCKET_URL}${imageUrl}`
    : `https://picsum.photos/${_opts.width}/${_opts.height}`
}
