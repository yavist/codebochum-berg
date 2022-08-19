export function showInfoModal(title, content, confirmButtonText, themeColor) {
    let options = {
        titleText: title,
        text: content,
        icon: 'info',
        confirmButtonText: confirmButtonText
    }

    if (themeColor) {
        options.confirmButtonColor = themeColor
        options.iconColor = themeColor
    }

    return Swal.fire(options)
}