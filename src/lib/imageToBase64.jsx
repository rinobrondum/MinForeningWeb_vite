function imageToBase64(image, {scaleWidth} = {scaleWidth: 800}) {
  if (image instanceof File) {
    return new Promise((resolve) => {
      const reader = new FileReader()

      reader.onload = () => {
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        const img = new Image()

        img.onload = () => {
          const factor = scaleWidth < img.width ? scaleWidth / img.width : 1

          canvas.width = img.width * factor
          canvas.height = img.height * factor

          context.drawImage(img, 0, 0, canvas.width, canvas.height)

          resolve(canvas.toDataURL().split(',')[1])
        }

        img.src = reader.result
      }

      reader.readAsDataURL(image)
    })
  }
}

export default imageToBase64
