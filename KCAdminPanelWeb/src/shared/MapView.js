import React, { useState, createRef } from "react";
import { Dialog, DialogActions, DialogContent, Slide } from '@material-ui/core'
import { Close } from "@material-ui/icons";
import { DEFAULT_MAP_VALUES, MAP_API_KEY } from "../configs";
import GoogleMapReact from 'google-map-react'
import { SubmitButton } from ".";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
export function MapView(props) {

    const [selectedCords, setSelectedCords] = useState('')
    const searchAddress = createRef()
    const [address, setAddress] = useState('')

    const loadMap = (map, maps) => {
        // const cityCircle = new maps.Circle({
        //   strokeColor: "#FF0000",
        //   strokeOpacity: 0.8,
        //   strokeWeight: 2,
        //   fillColor: "#FF0000",
        //   fillOpacity: 0.35,
        //   map,
        //   center: convertStringToLocation() || props.center || DEFAULT_MAP_VALUES.center,
        //   radius: 10000,
        //   draggable: true
        // });
        setAddressFromCoordinates(convertStringToLocation())
    
        const marker = new maps.Marker({
            position: convertStringToLocation() || props.center || DEFAULT_MAP_VALUES.center,
            map,
            draggable:true
        });

        const options = {
            fields: ["formatted_address", "geometry", "name"],
            strictBounds: false,
            types: ["establishment"],
        };

        console.log(searchAddress)
        
        const autocomplete = new maps.places.Autocomplete(searchAddress.current, options);
        autocomplete.bindTo("bounds", map);

        autocomplete.addListener("place_changed", () => {

            const place = autocomplete.getPlace();
            if (!place.geometry || !place.geometry.location) {
                console.log("No details available for input: '" + place.name + "'");
                return;
            }
            marker.setVisible(false);

            if (place.geometry.viewport) {
                map.fitBounds(place.geometry.viewport);
            } else {
                map.setCenter(place.geometry.location);
                map.setZoom(props.zoom || 10);
            }
            marker.setPosition(place.geometry.location);
            marker.setVisible(true);
            geocodePosition(marker.getPosition());
        });

        maps.event.addListener(marker, 'dragend', function() {
           geocodePosition(marker.getPosition());
        });
    };

    // This function for convert the string to location object
    const convertStringToLocation = () => {
        let locationArray = '';
        if(props.selectedValue && props.selectedValue !== '') {
            locationArray = props.selectedValue.trim().split(',').map(item => Number(item.trim()))
        }
        return locationArray.length > 0 ? { lat: locationArray[0], lng: locationArray[1] } : ''
    }

    const geocodePosition = (position) => {
        setSelectedCords(position.lat().toString() + ',' + position.lng().toString())
        setAddressFromCoordinates(position);
    }

    const setAddressFromCoordinates = (position) => {
        if(position) {
            // Below code for getting the address based on the coordinates
            const google = window.google
            let geocoder = new google.maps.Geocoder();
            geocoder.geocode({
                    latLng: position
                }, 
                function(results, status) {
                    if (status === google.maps.GeocoderStatus.OK) {
                        console.log(results)
                        setAddress(results[0].formatted_address);
                    } else {
                        console.log('Cannot determine address at this location.' + status);
                    }
                }
            );
        }
    }

    const handleSelect = () => {
        props.setPosition(selectedCords);
        props.onHide()
    }

    return (
        <Dialog open={props.show} onClose={props.onHide} TransitionComponent={Transition} maxWidth={'md'} className="map-picker">
            <div className="d-flex justify-content-between align-items-center border-bottom py-4 px-3">
                <div className="primary-title text-capitalize">{props.title || 'Map'}</div>
                <button onClick={props.onHide} className="closeButton">
                    <Close/>
                </button>
            </div>
            <DialogContent>
                <input className="form-control mb-3" value={address} onChange={(e) => setAddress(e.target.value)} type="text" ref={searchAddress} />
                <div style={{
                    position: 'relative'
                }}>
                    <GoogleMapReact
                        bootstrapURLKeys={{ key: MAP_API_KEY, libraries:['places'] }}
                        defaultCenter={convertStringToLocation() || props.center || DEFAULT_MAP_VALUES.center}
                        defaultZoom={props.zoom || 10}
                        style={{
                            height: props.mapHeight ? props.mapHeight : 250,
                            width: 600,
                            maxWidth: '100%'
                        }}
                        yesIWantToUseGoogleMapApiInternals
                        onGoogleApiLoaded={({ map, maps }) => loadMap(map, maps)}
                    />
                </div>
            </DialogContent>
            <DialogActions className="border-top py-3">
                <SubmitButton disabled={selectedCords === ''} onClick={handleSelect}>
                    {props.submitButtonText || 'Select Location'}
                </SubmitButton>
            </DialogActions>
        </Dialog>
    );
}