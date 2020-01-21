// from @raivo-fishmeister on StackOverflow
// https://stackoverflow.com/a/13419367
function parse_query(query_string) {
    var query = {}
    var pairs = (query_string[0] === '?' ? query_string.substr(1) : query_string).split('&')
    for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i].split('=')
        query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '')
    }
    return query
}

// from @broofa on StackOverflow
// https://stackoverflow.com/a/2117523
function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

let query_parameters = parse_query(window.location.search)
let username = query_parameters['username']
let email = query_parameters['email']

// global page state variables
var viewname = 'outfit-builder'
var parameters = {}

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
        for (i = 0; i < database.length; i++) {
            let item = database[i]
            display_closet_item(item)
        }
    }
    else if (viewname == 'closet-view') {
        document.getElementById('closet-view').style.display = ''
        for (i = 0; i < database.length; i++) {
            let item = database[i]
            if (item['category'] == parameters['category']) {
                display_closet_view_item(item)
            }
        }
        
    }
    
}

document.getElementById('plus').onclick = function() {
    display('outfit-builder', {})
}

document.getElementById('shirt').onclick = function() {
    display('closet-view', {'category': 'top'})
}

document.getElementById('shoe').onclick = function() {
    display('closet-view', {'category': 'shoes'})      
}

document.getElementById('pants').onclick = function() {
    display('closet-view', {'category': 'bottom'})      
}

document.getElementById('clock').onclick = function() {
}

display('outfit-builder', {})

document.getElementById('add-clothes').onclick = function() {
    database.push({
        id: uuid(),
        category: parameters['category'],
        name: document.getElementById('clothes-name').value,
        color: document.getElementById('clothes-color').value
    })
    localStorage.setItem('database', JSON.stringify(database))
    display(viewname, parameters)
}

// set up Sortable.js for the outfit builder interface
let outfit = document.getElementById('outfit')
let closet = document.getElementById('closet-items')
Sortable.create(outfit, {group: 'outfit-builder'})
Sortable.create(closet, {group: 'outfit-builder'})

//
// item schema
// { name: str,
//   category: str }

function display_item_in_container(container, item) {
    var el = document.createElement('li')
    
    var name = document.createElement('span')
    name.textContent = item['name']
    name.style.color = item['color']
    el.appendChild(name)
    
    var x = document.createElement('button')
    x.textContent = 'delete'
    x.style.color = 'red'
    el.appendChild(x)
    x.onclick = (function(parent, item) {
        return function() {
            parent.parentElement.removeChild(parent)
            for (let i = 0; i < database.length; i++) {
                console.log(database[i]['id'])
                if (item['id'] == database[i]['id']) {
                    console.log('splicing!!')
                    database.splice(i, 1)
                    localStorage.setItem('database', JSON.stringify(database))
                }
            }
        }
    })(el, item)

    container.appendChild(el)
}

function display_closet_item(item) {
    display_item_in_container(document.getElementById('closet-items'),
                              item)
}

function display_closet_view_item(item) {
    display_item_in_container(document.getElementById('closet-view-items'),
                              item)
}

