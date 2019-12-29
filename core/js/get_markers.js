(function() {
    function cssSelector(el) {
        if (!(el instanceof Element))
            return;
        var path = [];
        while (el.nodeType === Node.ELEMENT_NODE) {
            var selector = el.nodeName.toLowerCase();
            if (el.id) {
                selector += '#' + el.id;
                path.unshift(selector);
                break;
            } else {
                var sib = el, nth = 1;
                while (sib = sib.previousElementSibling) {
                    if (sib.nodeName.toLowerCase() == selector)
                        nth++;
                }
                if (nth != 1)
                    selector += ":nth-of-type("+nth+")";
            }
            path.unshift(selector);
            el = el.parentNode;
        }
        return path.join(" > ");
    }
    function getCoords(link){
        let rect = link.getBoundingClientRect();
        return [ rect.top, rect.left, rect.right, rect.bottom, cssSelector(link) ];
    }
    function isElementOnScreen(rect){
        let clientHeight = document.documentElement.clientHeight;
        let clientWidth = document.documentElement.clientWidth;
        return (rect[0] >= 0 && rect[0] <= clientHeight &&
                rect[1] >= 0 && rect[1] <= clientWidth &&
                rect[2] != 0 && rect[3] != 0);
    }
    function addElementToRects(validRects, elements){
        let rect;
        for(let i = 0; i < elements.length; i++) {
            rect = getCoords(elements[i]);
            if(isElementOnScreen(rect)){
                validRects.push(rect);
            }
        }
    }
    function generateKeys(markerContainer) {
        let letters = ['A', 'S', 'D', 'F', 'H', 'J', 'K', 'L', 'Q', 'W', 'E', 'O', 'P', 'N', 'M', 'X', 'C' ];
        let linkNum = markerContainer.children.length;
        let keyLen = Math.ceil(Math.log(linkNum)/Math.log(letters.length));
        let keys = [];
        while(linkNum > 0) {
            let k = "";
            for (let i = 0; i < keyLen; i++) {
                k += letters[Math.floor(Math.random()*letters.length)];
            }
            if(!keys.includes(k)) {
                linkNum--;
                keys.push(k);
                for (let i = 0; i < keyLen; i++) {
                    let mark = document.createElement('span');
                    mark.setAttribute('class', 'mark');
                    mark.setAttribute('style', 'font-size: small');
                    mark.textContent = k.charAt(i);
                    markerContainer.children[linkNum].appendChild(mark);
                }
                markerContainer.children[linkNum].setAttribute('key', k);
            }
        }
        return keys;
    }

    let validRects = [];
    addElementToRects(validRects, document.links);
    addElementToRects(validRects, document.querySelectorAll('button'));
    addElementToRects(validRects, document.querySelectorAll('input'));

    let body = document.querySelector('body');
    let markerContainer = document.createElement('div');
    markerContainer.setAttribute('class', 'markerContainer');
    body.insertAdjacentElement('afterend', markerContainer);
    for(let i = 0; i < validRects.length; i++) {
        let marker = document.createElement('div');
        marker.setAttribute('class', 'marker');
        marker.setAttribute('style', 'left: ' + validRects[i][1] + 'px; top: '+ validRects[i][0] + 'px; z-index: 100000; position: fixed; ' +
                            ' background-color: yellow; border: 1px solid red');
        marker.setAttribute('pointed-link', validRects[i][4]);

        markerContainer.appendChild(marker);
    }
    return generateKeys(markerContainer);
})()
