(function() {

  var controlArrows = document.getElementsByClassName('fp-controlArrow');

  // Getting the users options from the SECOND section -------------------------
  var getGuests = document.getElementById('getGuests');

  var getCheckInDate = document.getElementById('getCheckIn');
  var getCheckOutDate = document.getElementById('getCheckOut');
  var nightsSelected = document.getElementById('nightsSelected');
  var nightsText = document.getElementById('nightsText');

  var getMeals = document.getElementById('getMealOption');

  var getSubBtn = document.getElementById('submitBtn');
  var errorMessage = document.createElement('div');

  // The button which pushes the details entered into an array -----------------
  var browseBtn = document.getElementById('browseBtn');

  // Getting the results elements from the FIFTH section -----------------------
  var finalGuest = document.getElementById('guestsCount');
  var finalMealsOption = document.getElementById('mealsOption');
  var finalNights = document.getElementById('nightCount');

  var totalCost = document.getElementById('totalCost');

  var refNum = document.getElementById('refNum');

  var userResults = [];
  var userAccomOption = [];


// -----------------------------------------------------------------------------


  // LOADING ICON
  $(window).load(function(){
    $('.loader').fadeOut();
  });


// -----------------------------------------------------------------------------

  $(document).ready(function() {

    // PAGE PILING PLUGIN
    $('#fullpage').fullpage({
      verticalCentered: true,
      anchors: ['firstPage', 'secondPage', '3rdPage', 'fourthPage', 'fifthPage'],
      sectionsColor: ['white', '#D66761', '#D66761', 'transparent', '#D66761'],
      bgSize: ['cover', 'cover', 'cover', 'cover', 'cover'],
      slidesNavigation: true,
    });

    // Splash screen button
    $('#exploreBtn').click(function(e){
      e.preventDefault();
      $.fn.fullpage.setScrollingSpeed(1000);
      $.fn.fullpage.moveSectionDown();
    });


// -----------------------------------------------------------------------------


    // DATE PICKER PLUGIN

    $('.datepicker1').pickadate({
      clear: '',
      min: new Date(),
    });

    $('.datepicker2').pickadate({
      clear: '',
      min: new Date(),
      onClose: function () {
        calculateNights()
      }
    });


// -----------------------------------------------------------------------------


    function calculateNights () {

      // Calculate how many nights in between the chosen dates
      var startDate = Date.parse(getCheckIn.value);
      var endDate = Date.parse(getCheckOut.value);
      var timeDiff = endDate - startDate;
      daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

      // Push the date to view on the slide
      nightsSelected.innerText = daysDiff;
      dateErrorMsg();

    }

    // if (isNaN(nightsSelected)) {
    //   nightsSelected.textContent = '0';
    // }


// -----------------------------------------------------------------------------


    // Auto scroll on click the View Results button
    $('#viewResultsBtn').click(function(e){
      e.preventDefault();
      $.fn.fullpage.setScrollingSpeed(1000);
      $.fn.fullpage.moveSectionDown();
      $.fn.fullpage.setAllowScrolling(false);
    });


//----------------------------------------------------------------------------


    // FORM VALIDATION
    window.addEventListener('load',
    function formValidation() {

      // Fetch all the forms we want to apply custom Bootstrap validation styles to
      var forms = document.getElementsByClassName('needs-validation');
      // Loop over them and prevent submission
      var validation = Array.prototype.filter.call(forms, function(form) {
        form.addEventListener('submit', function(event) {
          if (form.checkValidity() === false || nightsSelected.textContent > 15 || nightsSelected.textContent < 1 || nightsSelected.textContent === NaN) {
            event.preventDefault();
            event.stopPropagation();

            // Show an error message which is created here along with fadeOut and removes from code.
            errorMessage.className = 'errorMessage';
            errorMessage.innerText = "Hold up! Look like something's missing. Please check to see if you've entered your details correctly.";
            getSubBtn.after(errorMessage);

            $('.errorMessage').fadeOut(6000, function(){
              $('.errorMessage').remove();
            });
          }
          form.classList.add('was-validated');
        }, false);
      });
    }, false);


    // Form doesn't refresh the page
    $("form").submit(function() {
       return false;
    });

// -----------------------------------------------------------------------------


    // Add a message when too less or too many nights have been selected
    // remove the message and uncolor the inputs when the task the nights are correct

    function dateErrorMsg() {
      if (nightsSelected.textContent > 15 || nightsSelected.textContent < 1) {

        var nightsErrorMsg = document.createElement('p');
        getCheckInDate.style.border = '1px solid #DC1C0C';
        getCheckOutDate.style.border = '1px solid #DC1C0C';
        nightsErrorMsg.className = 'nightsErrorMsg';
        nightsErrorMsg.style.margin = '1em';
        nightsErrorMsg.textContent = 'You have selected an incorrect amount of days. Please try again.';
        nightsText.after(nightsErrorMsg);

      } else {
        $('.nightsErrorMsg').remove();
        getCheckInDate.style.borderColor = '';
        getCheckOutDate.style.borderColor = '';
      }

    }


// -----------------------------------------------------------------------------


    // Scroll section down on click when validation is complete

    getSubBtn.addEventListener('click', scrollDown , false);

    function scrollDown() {

      // If there is a value in the inputs the page and the nights staying is 1-15
      // the page will auto scroll
      if (getGuests.validity.valueMissing === false && getMeals.validity.valueMissing === false
      && nightsSelected.textContent >= 1 && nightsSelected.textContent <= 15) {

        $.fn.fullpage.setScrollingSpeed(1000);
        $.fn.fullpage.moveSectionDown();
        $.fn.fullpage.setAllowScrolling(false);
      }

    }


// -----------------------------------------------------------------------------

    // SUCCESS PAGE

    // Auto scroll on click the Browse Accomodation button
    $('#browseBtn').click(function(e){
      e.preventDefault();
      $.fn.fullpage.setScrollingSpeed(1000);
      $.fn.fullpage.moveSectionDown();
      $.fn.fullpage.setAllowScrolling(false);
      pushResults();
    });

    // Pushing all results to an array
    function pushResults() {

      // Turn guests input from string to number
      var guestsStringToNum = parseInt(getGuests.value);
      var mealStringToNum = parseInt(getMeals.value);

      userResults.push({guests: guestsStringToNum, nights: daysDiff, meals: mealStringToNum});
      // push meal name too
      console.log(userResults);
    }

// -----------------------------------------------------------------------------

    //SETTING UP MAP

    var token = 'pk.eyJ1Ijoic3VtaXRyYW0iLCJhIjoiY2ppbDA5ajh5MmpuMTNwb250MXR0ZWI1ayJ9.4K0zZ6PO_bnYu76JJUOmoQ';

    mapboxgl.accessToken = 'pk.eyJ1Ijoic3VtaXRyYW0iLCJhIjoiY2ppbDA5ajh5MmpuMTNwb250MXR0ZWI1ayJ9.4K0zZ6PO_bnYu76JJUOmoQ';

    var map = new mapboxgl.Map({
      container: 'map', // container id
      style: 'mapbox://styles/sumitram/cji3p2cwm0s6r2smz01nlidgc', // stylesheet location
      center: [174.763222, -36.854191], // starting position [lng, lat]
      zoom: 9 // starting zoom
    });


    // ADDING A POP UP ---------------------------------------------------------------
        map.on('load', function() {
        // Add a layer showing the places.
        map.addLayer({
          "id": "places",
          "type": "symbol",
          "source": {
            "type": "geojson",
            "data": {
              "type": "FeatureCollection",
              "features": [{
                "type": "Feature",
                "properties": {
                  "description": "<strong>Wellington Railway Station</strong><p>This is the main railway station in the Wellington Region.</p>",
                  "icon": "star"
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": [174.452166, -36.883217]
                }
              }]
            }
          },
          "layout": {
              "icon-image": "{icon}-15",
              "icon-allow-overlap": true,
              "icon-size": 1
          }
        });
        // Create a popup, but don't add it to the map yet.
        var popup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false
        });
        map.on('mouseenter', 'places', function(e) {
            // Change the cursor style as a UI indicator.
            map.getCanvas().style.cursor = 'pointer';
            var coordinates = e.features[0].geometry.coordinates.slice();
            var description = e.features[0].properties.description;
            // Ensure that if the map is zoomed out such that multiple
            // copies of the feature are visible, the popup appears
            // over the copy being pointed to.
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }
            // Populate the popup and set its coordinates
            // based on the feature found.
            popup.setLngLat(coordinates)
                .setHTML(description)
                .addTo(map);
        });
        map.on('mouseleave', 'places', function() {
            map.getCanvas().style.cursor = '';
            popup.remove();
        });
    });



// -----------------------------------------------------------------------------


    var geojson = {
        "type": "FeatureCollection",
        "features": [


// ------------------------------- ACCOMMODATION -------------------------------

// House --------------------------------------------------
            {
                "type": "Feature",
                "properties": {
                    "message": "Foo",
                    "iconSize": [20, 20]
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": [
                        174.762191,
                        -36.848414
                        // -36.848414, 174.762191
                    ]
                }
            },


// Hotel --------------------------------------------------
            {
                "type": "Feature",
                "properties": {
                    "message": "Bar",
                    "iconSize": [50, 50]
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": [
                        -61.2158203125,
                        -15.97189158092897
                    ]
                }
            },


// Motel --------------------------------------------------
            {
                "type": "Feature",
                "properties": {
                    "message": "Baz",
                    "iconSize": [40, 40]
                    // "marker-color": 'pink'
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": [
                        -63.29223632812499,
                        -18.28151823530889
                    ]
                }
            },


// Hostel --------------------------------------------------
            {
                "type": "Feature",
                "properties": {
                    "message": "Bar",
                    "iconSize": [50, 50]
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": [
                        -174.771945,
                        -36.835333
                    ]
                }
            },


// -------------------------------- ATTRACTIONS --------------------------------

// Sky Tower -------------------------------------------------------------------
            {
                "type": "Feature",
                "properties": {
                    "message": "Sky Tower",
                    "iconSize": [60, 60]
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": [
                        174.762191,
                        -36.848414
                    ]
                }
            },

// Queens Street ---------------------------------------------------------------
            {
                "type": "Feature",
                "properties": {
                    "message": " Queens Street",
                    "iconSize": [60, 60]
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": [
                        174.764615,
                        -36.850473
                    ]
                }
            },

// Stardome Observatory & Planetarium ------------------------------------------
            {
                "type": "Feature",
                "properties": {
                    "message": " Queens Street",
                    "iconSize": [60, 60]
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": [
                        174.776985,
                        -36.905937
                    ]
                }
            },

// Auckland War Memorial Museum ------------------------------------------------
            {
                "type": "Feature",
                "properties": {
                    "message": "Auckland War Memorial Museum",
                    "iconSize": [60, 60]
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": [
                        174.777791,
                        -36.860364
                    ]
                }
            },

// Auckland War Memorial Museum ------------------------------------------------
            {
                "type": "Feature",
                "properties": {
                    "message": "Auckland War Memorial Museum",
                    // "icon": {
                      "iconSize": [60, 60],
                    //   "iconUrl": "../img/pin.svg",
                    // }
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": [
                        174.767883,
                        -36.850609
                    ]
                }
            },

// Hunua Falls ----------------------------------------------------------
            {
                "type": "Feature",
                "properties": {
                    "message": "Hunua Falls",
                    "iconSize": [60, 60]
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": [
                        175.089838,
                        -37.068550
                    ]
                }
            },

// Te Henga Walkway. Bethells Beach to Muriwai ---------------------------------
            // {
            //     "type": "Feature",
            //     "properties": {
            //         "title": "Hello World",
            //         "message": "Te Henga Walkway",
            //         "iconSize": [50, 50],
            //
            //     },
            //     "geometry": {
            //         "type": "Point",
            //         "coordinates": [
            //             174.452166,
            //             -36.883217
            //         ]
            //     }
            // },


// -----------------------------------------------------------------------------


        ] // Feature ends
    }; // geojson ends

    // Add markers to the map
    geojson.features.forEach(function(marker) {

      // Create a DOM element for the marker
      var el = document.createElement('div');
      el.className = 'marker';
      el.style.backgroundImage = 'url("img/pin.svg")';
      el.style.backgroundSize = 'contain';
      el.style.width = marker.properties.iconSize[0] + 'px';
      el.style.height = marker.properties.iconSize[1] + 'px';

      el.addEventListener('click', function() {
        window.alert(marker.properties.message);
      });

      // Add marker to map
      new mapboxgl.Marker(el)
      .setLngLat(marker.geometry.coordinates)
      .addTo(map);
    });


// -----------------------------------------------------------------------------

    // Reference number on summary

    function createRefNum() {
      var randomNum = Math.floor((Math.random() * 1000000) + 1);
      refNum.innerText = '#' + randomNum;
    }

    createRefNum();


  }); // DOCUMENT READY ENDS
}()); // IIFE ENDS
