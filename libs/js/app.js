
//Google Maps
function initMap(){
    getLocation();
};

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showLocalPosition,showError);
    } else {
        setMap(44.7965522, 20.4327851);
    }
};

function showLocalPosition(position) {
    var myLat = position.coords.latitude;
    var myLng = position.coords.longitude;
    setMap(myLat,myLng);
};

function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.")
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.")
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out.")
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.")
            break;
    }
};

function setMap(lat, lng){
    var loc= {lat: lat, lng: lng};

    map = new google.maps.Map(document.getElementById('map'), {
        center: loc,
        scrollwheel: true,
        zoom: 13
    });

    getCoffePlaces(lat,lng, map);

    var marker = new google.maps.Marker({
        position: loc,
        map: map,
        title: "You're Here!"
      });
};

// Foursquare API
function getCoffePlaces(myLat,myLng,map){
    var allMarkers = [];
    //I was change radius in this API to 5km because  i don't have enough data but limit is on 10 coffee shops
    var url = 'https://api.foursquare.com/v2/venues/search?v=20171010&ll=' + myLat + '%2C%20'+ myLng +'&query=coffee&limit=10&intent=browse&radius=5000&client_id=XP1OWSPGSMPYNOXMNL4SCDZLGIYFXXSBBLL0MS0J51NK2RV3&client_secret=ARLVYDYXT2IZPVRXHXOECCCKSACNEO0JFF0EVMGWSNHSKEVW';
    $.ajax({
        type: 'GET',
        url: url,
        dataType: 'json',
        success: function(data){
            var coffeeShop = data.response.venues;
            //set to localStorage
            var coffeeShopsData = JSON.stringify(coffeeShop);
            localStorage.setItem('shopData',coffeeShopsData);
            //set to localStorage - END
            var h="";
            if (coffeeShop.length > 0){
                coffeeShop.sort(function(a,b){
                    return (a.location.distance < b.location.distance)?-1:(a.location.distance > b.location.distance)?1:0;
                })
                for (var i=0; i<coffeeShop.length;i++){
                    allMarkers.push({lat:coffeeShop[i].location.lat, lng:coffeeShop[i].location.lng, name:coffeeShop[i].name})
                    h += showThumbs(coffeeShop[i]);
                }
                document.getElementById('coffe-shops-list').innerHTML = h;
            } else {
                alert("No Coffee Today!!!")
            }
            displayMarkers(allMarkers,map);
        },
        error: function(data, status){
            alert("Api error!!")
        },
    });
};

function displayMarkers(data,map){
    if (data != ""){
        for(var i=0; i<data.length;i++){
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(data[i].lat, data[i].lng),
                title: data[i].name,
                map: map,
            });
            marker.setIcon('../libs/img/blue-dot.png');
            marker.setMap(map);
        }
    }
};

function showThumbs(data){
    var html = "";

    html += "<div class='coffeeShopThumb'>";
        html+="<a href='javascript:void(0)' data-id=" + data.id + " onclick='getDetails(this)'>";
            html += "<div class='shop-thumb'>";
                html += "<div class='shop-info'>";
                    html += "<h4>" + data.name+"</h4>";
                    html += "<span>Address: " + data.location.address + "</span>"
                    html += "<span>Dist: " + data.location.distance + "m</span>"
                html += "</div>";
                html += "<div class='shop-image'>";
                    html +='<img src="libs/img/coffee-cup.png">';
                html += "</div>";
            html += "</div>";
        html += "</a>";
    html += "</div>";

    return html;
};

function getDetails(el){
    var h = "";
    var coffeShopId = "";
    var data = "";
    var shop = "";

    $(".modal").css("display","block");
    
    coffeShopId = $(el).data("id");
    data = localStorage.getItem('shopData');
    data = JSON.parse(data);

    shop = data.filter(function(oneShop){
        return oneShop.id === coffeShopId;
    })

    for (var i=0; i < shop.length; i++){
        h += "<div class='details-box'>";
            h += "<div class='details-data'><i class='fa fa-user' aria-hidden='true' title='Name'></i> " + shop[i].name + "</div>";
            h += "<div class='details-data'><i class='fa fa-map-marker' aria-hidden='true' title='Address'></i> " + shop[i].location.address + "</div>";
            h += "<div class='details-data'><i class='fa fa-building' aria-hidden='true' title='City'></i> " + shop[i].location.city + "</div>";
            h += "<div class='details-data'><i class='fa fa-globe' aria-hidden='true' title='Country'></i> " + shop[i].location.country + "</div>";
            h += "<div class='details-data'><i class='fa fa-map' aria-hidden='true' title='Distance'></i> " + shop[i].location.distance + "m</div>";
            h += "<div class='details-data'><i class='fa fa-location-arrow' aria-hidden='true' title='Location'></i> Lat:" + shop[i].location.lat + ", Lng: " + shop[i].location.lng + "</div>";
            if (shop[i].contact.facebookName != undefined){
                h += "<div class='details-data'><i class='fa fa-facebook' aria-hidden='true' title='Facebook'></i> " + shop[i].contact.facebookName + "</div>";
            } 
            if (shop[i].contact.formattedPhone != undefined){
                h += "<div class='details-data'><i class='fa fa-phone' aria-hidden='true' title='Phone'></i> " + shop[i].contact.formattedPhone + "</div>";
            } 
            h += "<div class='details-data'><i class='fa fa-check' aria-hidden='true' title='Checkins Count'></i> " + shop[i].stats.checkinsCount + "</div>";
            h += "<div class='details-data'><i class='fa fa-star' aria-hidden='true' title='Tip Count'></i> " + shop[i].stats.tipCount + "</div>";
            h += "<div class='details-data'><i class='fa fa-user-plus' aria-hidden='true' title='Users Count'></i> " + shop[i].stats.usersCount + "</div>";
        h += "</div>";
    }
    $(".modal-body").html(h);
};
//Sort CoffeeShops
function sortByDistance(){
    var h = "";
    var data = "";
    data = localStorage.getItem('shopData');
    data = JSON.parse(data);
    document.getElementById('coffe-shops-list').innerHTML = "";
    if (data != ""){
        data.sort(function(a,b){
            return (a.location.distance < b.location.distance)?-1:(a.location.distance > b.location.distance)?1:0;
        });
        for (var i=0;i<data.length;i++){
            h += showThumbs(data[i]);
        }
            document.getElementById('coffe-shops-list').innerHTML = h;
    } else {
        alert("No Data!!!");
    }
};

function sortByName(){
    var h = "";
    var data = "";
    data = localStorage.getItem('shopData');
    data = JSON.parse(data);
    document.getElementById('coffe-shops-list').innerHTML = "";
    if (data != ""){
        data.sort(function(a,b){
            return (a.name < b.name)?-1:(a.name > b.name)?1:0;
        });
        for (var i=0;i<data.length;i++){
            h += showThumbs(data[i]);
        }
            document.getElementById('coffe-shops-list').innerHTML = h;
    } else {
        alert("No Data!!!");
    }
};

//Modal
function closeModal(){
    $(".modal").css("display","none");
};

$(document).on('click', function(e){
    if(e.target.className == 'modal'){
        $(".modal").css("display","none");
    };
});
//Menu
function toggleMenu (){
    $("header nav ul").toggleClass('open');
};


// I was create and verify account on Foursquare and after that I used this API call 
// for search data: https://api.foursquare.com/v2/venues/search?v=20131016&intent=checkin - with
// appropriate query strings(coordinates, client_id, client_secret, limit...) but in some reason 
// I don't reseave all data, i don't have images and some other data necessary for this task.

// Also, this API call don't work for me to: https://api.foursquare.com/v2/venues/{VENUE_ID}?v=20131016
// here I was supposed to insert the VENUE_ID that returned me the previous API and on the basis 
// of it I get the details related to the venue

// I'm not sure where is the problem with this Forsquare API calls,maybe I need to be authorized to have a complete approach, 
// but it was not very clear to me the authorization process on their site.  I use client_id ad client_secret.
// That's why I finish the task with the data I had available

//The detail modal is triggered after clicking on the thumb with the data of a specific location

//I used: NPM, Bower, Grunt, SASS, JQuery