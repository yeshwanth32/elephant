// global page state variables
var viewname = 'outfit-builder';
var parameters = {};

// load database from localStorage if one already exists, if not create a new
// one
old_database = localStorage.getItem('database')
if (old_database != null) {
    database = JSON.parse(old_database)
}
else {
    database = []
}

function hide_all() {
    document.getElementById('outfit-builder').style.display = 'none'
    document.getElementById('closet-view').style.display = 'none'
    document.getElementById('closet-items').innerHTML = ''
}

function display(_viewname, _parameters) {
    hide_all()
    viewname = _viewname
    parameters = _parameters
    if (viewname == 'outfit-builder') {
        document.getElementById('outfit-builder').style.display = ''
    }
    else if (viewname == 'closet-view') {
        document.getElementById('closet-view').style.display = ''
        for (i = 0; i < database.length; i++) {
            let item = database[i]
            if (item['category'] == parameters['category']) {
                display_item(item)
            }
        }
        
    }
    
}

document.getElementById('plus').onclick = function() {
    display('outfit-builder', {});
}

document.getElementById('shirt').onclick = function() {
    display('closet-view', {'category': 'top'});
}

document.getElementById('shoe').onclick = function() {
    display('closet-view', {'category': 'shoes'});      
}

document.getElementById('pants').onclick = function() {
    display('closet-view', {'category': 'bottom'});      
}

document.getElementById('clock').onclick = function() {
}

display('outfit-builder', {})

document.getElementById('add-clothes').onclick = function() {
    database.push({
        category: parameters['category'],
        name: document.getElementById('clothes-name').value,
        color: document.getElementById('clothes-color').value
    })
    localStorage.setItem('database', JSON.stringify(database))
    display(viewname, parameters);
}

// set up Sortable.js for the outfit builder interface
let outfit = document.getElementById('outfit');
let closet = document.getElementById('closet')
Sortable.create(outfit, {group: 'outfit-builder'});
Sortable.create(closet, {group: 'outfit-builder'});

function display_item(item) {
    var el = document.createElement('div')
    
    var name = document.createElement('span')
    name.textContent = item['name']
    el.appendChild(name)
    
    var x = document.createElement('span')
    x.textContent = 'x'
    el.appendChild(x)
    x.onclick = (function(parent) {
        return function() {
            parent.parentElement.removeChild(parent)
        }
    })(el)

    document.getElementById('closet-items').appendChild(el)
}