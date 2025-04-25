from django.utils.safestring import mark_safe

text_color = {
    "red": " text-red dark:text-red",
    "green": " text-green dark:text-green",
    "blue": " text-blue dark:text-blue",
    "yellow": " text-yellow dark:text-yellow",
    "pink": " text-pink dark:text-pink",
    "purple": " text-purple dark:text-purple",
    "teal": " text-teal dark:text-teal",
    "gray": " text-gray dark:text-gray",
}

bg_color = {
    "red": " bg-red dark:bg-red",
    "green": " bg-green dark:bg-green",
    "blue": " bg-blue dark:bg-blue",
    "yellow": " bg-yellow dark:bg-yellow",
    "pink": " bg-pink dark:bg-pink",
    "purple": " bg-purple dark:bg-purple",
    "teal": " bg-teal dark:bg-teal",
    "gray": " bg-gray dark:bg-gray",
}

def option_display(option, color="gray"):
    """
    Hiển thị một nút lựa chọn có màu
    
    Parameters
    ----------
        `option` : giá trị hiển thị
        `color`  : màu sắc của biểu tượng
    """
    class_name = "inline-block font-semibold leading-normal px-2 py-1 rounded uppercase text-xxs whitespace-nowrap"

    class_name += text_color.get(color)
    class_name += bg_color.get(color)
    
    return mark_safe(f"<span class='{class_name}'>{option}</span>")
