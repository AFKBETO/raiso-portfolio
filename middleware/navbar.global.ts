export default defineNuxtRouteMiddleware(() => {
    const menuOpen = useSlideoverOpen() 
    menuOpen.value = false 
})