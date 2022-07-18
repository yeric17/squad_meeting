export const clickOutside = function(node:HTMLElement) {
  
    const handleClick = (event:Event) => {
      if (node && !node.contains(event.target as Element) && !event.defaultPrevented) {
        node.dispatchEvent(
          new CustomEvent('click-outside', node as CustomEventInit<HTMLElement>)
        )
      }
    }
  
      document.addEventListener('click', handleClick, true);
    
    return {
      destroy() {
        document.removeEventListener('click', handleClick, true);
      }
      }
  }