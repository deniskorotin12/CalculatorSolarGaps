let unit;
let version = 'standart';

const CENTIMETER = 'm';
const INCH = 'ft';

const CENTIMETER_OPTIONS = {
    minWidth: 60,
    maxWidth: 250,
    minHeight: 60,
    maxHeight: 400
}

const INCH_OPTIONS = {
    minWidth: 24,
    maxWidth: 96,
    minHeight: 24,
    maxHeight: 156
}

const blindList = document.getElementById('blind-list');

let widthMinMaxLabel = document.querySelector('.min-max-width-label');
let heightMinMaxLabel = document.querySelector('.min-max-height-label');

function createElement(tag, props, ...children) {
    let element = document.createElement(tag);

    Object.keys(props).forEach(key => element[key] = props[key]);

    if (children.length > 0) {
        children.forEach(child => {
            if (typeof child === 'string') {
                child = document.createTextNode(child);
            }

            element.appendChild(child);
        });
    }

    return element;
}

function createBlindItem() {

    let widthInput = createElement('input', { type: 'number', className: 'item-width' });
    let widthWrapper = createElement('td', { className:    'width-wrapper' }, widthInput);

    let heightInput = createElement('input', { type: 'number', className: 'item-height' });
    let heightWrapper = createElement('td', { className: 'height-wrapper' }, heightInput);

    let countInput = createElement('input', { type: 'number', className: 'item-count', min: '1', max: '9999', value: '1' });
    let countWrapper = createElement('td', { className: 'count-wrapper' }, countInput);

    let squereWrapper = createElement('td', { className: 'squere-wrapper' });
    squereWrapper.innerHTML = '<span class="square"></span> (<span class="unit-label"></span> <sup style="font-weight: bold">2</sup>)';

    let priceWrapper = createElement('td', { className: 'price-wrapper' });
    priceWrapper.innerHTML = ' $<span class="price"></span>\u00A0';

    let buttonDelete = createElement('button', { className: 'btn-delete' }, 'Delete');
    let buttonWrapper = createElement('td', { className: 'button-wrapper' }, buttonDelete);

    const blindItem = createElement('tr', { className: 'blind-item' }, widthWrapper, heightWrapper, countWrapper, squereWrapper, priceWrapper, buttonDelete);

    bindEvents(blindItem);

    return blindItem;
}

function bindEvents(blindItem) {
    let deleteButton = blindItem.querySelector('.btn-delete');
    let unitLabel = blindItem.querySelector('.unit-label');
    unitLabel.textContent = unit;
    let inputs = blindItem.getElementsByTagName('input');    
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].addEventListener('blur', getSquareAndPrice);
        inputs[i].addEventListener('change', checkValue);
    }
    deleteButton.addEventListener('click', deleteItem);
}

function detectUnit() {
	let lang = navigator.language.toLowerCase().trim();
	return (lang === 'en' || lang === 'en-us') ? INCH : CENTIMETER;
}

function onUnitChanged(e) {
	let prevUnit = unit;
	unit = document.querySelector('#unit').value;

	if (prevUnit === unit) {
		return
	}

	updateMinMax();
    let unitLabels = document.querySelectorAll('.unit-label');

	unitLabels.forEach(function(unitLabel) {
		unitLabel.textContent = unit
	})
    getSquareAndPrice();
}

function onVersionChanged(e) {
	let prevVersion = version;
	version = document.querySelector('#version').value;

	if (prevVersion === version) {
		return
	}

    getSquareAndPrice();
}

function changeMinMaxOptions(widthInput, heightInput, options) {
    widthInput.value = options['minWidth'];
    widthInput.min = options['minWidth'];
    widthInput.max = options['maxWidth'];
    heightInput.value = options['minHeight'];
    heightInput.min = options['minHeight'];
    heightInput.max = options['maxHeight'];
    widthMinMaxLabel.innerText = options['minWidth'] + '/' + options['maxWidth'];
    heightMinMaxLabel.innerText = options['minHeight'] + '/' + options['maxHeight'];
}

function updateMinMax() {
    let blindItems = document.querySelectorAll('.blind-item');
    blindItems.forEach(function(item) {
	    let widthInput = item.querySelector('.item-width');
	    let heightInput = item.querySelector('.item-height');
        if (unit === 'm') {
            changeMinMaxOptions(widthInput, heightInput, CENTIMETER_OPTIONS);
        } else {
            changeMinMaxOptions(widthInput, heightInput, INCH_OPTIONS);
        }
    });
};

function getSquareAndPrice() {

    let blindItems = document.querySelectorAll('.blind-item');

    blindItems.forEach(function(item) {
        
        let square = item.querySelector('.item-width').value * item.querySelector('.item-height').value * item.querySelector('.item-count').value;

        item.querySelector('.square').innerText = square/1000;

        if (unit === 'm') {
            if (version === 'light') {
                item.querySelector('.price').innerText = Math.round(square * 0.00107639 * 18);
            } else {
                item.querySelector('.price').innerText = Math.round(square * 0.00107639 * 39);
            }
        } else {
            if (version === 'light') {
                item.querySelector('.price').innerText = Math.round(square * 0.00694444 * 18);
            } else {
                item.querySelector('.price').innerText = Math.round(square * 0.00694444 * 39);
            }

        }

    });
};

function addItem() {
    let blindItem = createBlindItem();
    blindList.appendChild(blindItem);

    let widthInput = blindItem.querySelector('.item-width');
    let heightInput = blindItem.querySelector('.item-height');

    if (unit === 'm') {
        changeMinMaxOptions(widthInput, heightInput, CENTIMETER_OPTIONS);
    } else {
        changeMinMaxOptions(widthInput, heightInput, INCH_OPTIONS);
    }

    getSquareAndPrice();

}

function deleteItem() {
    let blindItem = this.parentNode;
    blindList.removeChild(blindItem);
    calculate();
}

function checkValue(e) {
    if (+e.target.value > +e.target.max) {
        e.target.value = +e.target.max;
        return;
    }
    if (+e.target.value < +e.target.min) {
        e.target.value = +e.target.min;
        return;
    }
}

function calculate() {
    let prices = document.getElementsByClassName('price');
    let finalPrice = 0;    
    for (let i = prices.length; i--;) {
        finalPrice += +prices[i].innerText;
    }
    document.getElementById('final-price').innerText = '$ ' + finalPrice;
    document.getElementById('final-price-wrapper').style.display = 'block';;
}

function init() {
	let unitSelect = document.querySelector('#unit');
	let versionSelect = document.querySelector('#version');
    let inputs = document.getElementsByTagName('input');
    
    for (let i = inputs.length; i--;) {
        inputs[i].addEventListener('change', getSquareAndPrice);
    }

	unit = detectUnit();

	unitSelect.addEventListener('change', onUnitChanged);
	unitSelect.value = unit;

    versionSelect.addEventListener('change', onVersionChanged);
	versionSelect.value = version;

	updateMinMax();
    let unitLabels = document.querySelectorAll('.unit-label');

	unitLabels.forEach(function(unitLabel) {
		unitLabel.textContent = unit
	});

    getSquareAndPrice();

}

init();