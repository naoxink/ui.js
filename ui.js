UI = {  }

UI.UIElement = function(DOMElements){

  if(!DOMElements || (DOMElements.constructor === [].constructor && !DOMElements.length)){
    throw new Error('No DOMElement!')
  }

  if(DOMElements.constructor !== [].constructor){
    DOMElements = [ DOMElements ]
  }

  this.DOMElements = DOMElements

  this.getElements = function(){
    return this.DOMElements
  }

  this.updateHTML = function(html){
    this.DOMElements.map(function(dome){
      dome.innerHTML = html
    })
    return this
  }

  this.getHTML = function(){
    var htmls = this.DOMElements.map(function(dome){
      return dome.innerHTML
    })
    if(htmls.length > 1) return htmls
    else return htmls[0]
  }

  this.append = function(selector){
    if(typeof selector === 'string'){
      this.getElements().map(function(dome){
        UI.get(selector).getElements()[0].appendChild(dome)
      })
    }else if(selector.constructor === {}.constructor && typeof selector.getElements === 'function' && selector.getElements().length){
      selector.getElements()[0].appendChild(dome)
    }else{
      selector.appendChild(dome)
    }
    return this
  }

  this.prepend = function(selector){
    var parent = UI.get(selector).getElements()[0]
    this.getElements().map(function(dome){
      parent.insertBefore(dome, parent.firstChild)
    })
    return this
  }

  this.remove = function(){
    this.getElements().map(function(dome){
      UI.remove(dome)
    })
  }

  this.disable = function(){
    this.getElements().map(function(dome){
      dome.setAttribute('disabled', true)
    })
    return this
  }

  this.enable = function(){
    this.getElements().map(function(dome){
      dome.removeAttribute('disabled')
    })
    return this
  }

  this.isDisabled = function(){
    var results = this.getElements().map(UI.isDisabled)
    return results.length > 1 ? results : results[0]
  }

  this.setAttr = function(key, value){
    this.getElements().map(function(dome){
      dome.setAttribute(key, value)
    })
    return this
  }

  this.setAttrs = function(attrs){
    this.getElements().map(function(dome){
      for(var key in attrs){
        dome.setAttribute(key, attrs[key])
      }
    })
    return this
  }

  this.on = function(eventType, fn){
    var ui = this
    this.getElements().map(function(dome){
      dome.addEventListener(eventType, function(e){
        fn.call(ui, e)
      })
    })
    return this
  }

  this.style = function(){
    var args = [].slice.call(arguments)
    if(args.length === 2 && typeof args[0] === 'string' && typeof args[1] === 'string'){
      this.getElements().map(function(dome){
        dome.style[args[0]] = args[1]
      })
    }else if(args.length === 1 && args[0].constructor === {}.constructor){
      this.getElements().map(function(dome){
        for(var key in args[0]){
          dome.style[key] = args[0][key]
        }
      })
    }
    return this
  }

  this.hasClass = function(clss){
    var results = this.getElements().map(function(dome){
      results.push(UI.hasClass(dome, clss))
    })
    return results.length > 1 ? results : results[0]
  }

  this.addClass = function(clss){
    this.getElements().map(function(dome){
      UI.addClass(dome, clss)
    })
    return this
  }

  this.removeClass = function(clss){
    this.getElements().map(function(dome){
      UI.removeClass(dome, clss)
    })
    return this
  }

  this.map = function(fn){
    return this.getElements().map(function(e){
      return fn.call(e, UI.wrap(e), e)
    })
  }

  this.getClass = function(){
    return this.getElements().map(function(e){
      return UI.getClass(e)
    })
  }

  return this
}

// Crea un elemento DOM
UI.create = function(tag, options){
  var DOMElement = document.createElement(tag)
  if(options && options.constructor === {}.constructor){
    for(var key in options) DOMElement[key] = options[key]
  }
  return UI.wrap(DOMElement)
}

UI.wrap = function(DOMElement){
  return new UI.UIElement(DOMElement)
}

// Obtiene un elemento DOM
UI.get = function(selector, parent){
  var element = null
  if(!parent) element = document.querySelector(selector)
  else element = parent.querySelector(selector)
  if(!element) return null
  return UI.wrap(element)
}

// Obtiene un array de elementos DOM
UI.getAll = function(selector, parent){
  var elements = []
  if(!parent) elements = [].slice.call(document.querySelectorAll(selector))
  else elements = [].slice.call(parent.querySelectorAll(selector))
  return UI.wrap(elements)
}

// Elimina elementos del DOM
UI.remove = function(item){
  if(typeof item === 'string'){
    var els = UI.getAll(selector)
    for(var i = 0, l = els.length; i < l; i++){
      els[i].parentNode.removeChild(els[i])
    }
  }else if([].constructor === item.constructor){
    for(var i = 0, l = item.length; i < l; i++){
      item[i].parentNode.removeChild(item[i])
    }
  }else if(item.DOMElement && typeof item.remove === 'function'){
    item.remove()
  }else{
    item.parentNode.removeChild(item)
  }
}

// Muestra un elemento
UI.show = function(selector){
  var element = UI.get(selector)
  if(element) element.getElement().style.display = 'inherit'
  return element
}

// Oculta un elemento
UI.hide = function(selector){
  var element = UI.get(selector)
  if(element) element.getElement().style.display = 'none'
  return element
}

// Indica si un elemento tiene la clase indicada
UI.hasClass = function(el, clss){
  return new RegExp('\b' + clss + '\b', 'ig').test(el.className)
}

UI.trim = function(str){
  return str.replace(/^\s+|\s+$/g, '')
}

// Elimina una clase de un elemento
UI.removeClass = function(el, clss){
  var rgxp = new RegExp('\b' + clss + '\b', 'ig')
  el.className = el.className.replace(rgxp, '')
  el.className = UI.trim(el.className)
  return el
}

// Añade una clase a un elemento
UI.addClass = function(el, clss){
  if(UI.hasClass(el, clss)) return el
  el.className += ' ' + clss
  el.className = UI.trim(el.className)
  return el
}

UI.getClass = function(el){
  return el.className.split(' ')
}

// Deshabilita un elemento
UI.disable = function(el){
  el.setAttribute('disabled', true)
  return el
}

// Habilita un elemento
UI.enable = function(el){
  el.removeAttribute('disabled')
  return el
}

// Indica si un elemento está deshabilitado o no
UI.isDisabled = function(el){
  return el.getAttribute('disabled') === "true" || el.getAttribute('disabled') === "disabled"
}
