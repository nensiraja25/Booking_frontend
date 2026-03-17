import { useWS } from '@/service/WSProvider';
import { useUserStore } from '@/store/userStore';
import { mapStyles } from '@/styles/mapStyles';
import { customMapStyle, indiaIntialRegion } from '@/utils/CustomMap';
import { reverseGeocode } from '@/utils/mapUtils';
import { FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import * as Location from 'expo-location';
import haversine from 'haversine-distance';
import React, { FC, memo, useEffect, useRef, useState } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import { RFValue } from 'react-native-responsive-fontsize';

const DraggableMap: FC<{ height: number }> = ({ height }) => {

  const isFocused = useIsFocused();
  const [markers, setMarkers] = useState<any>([]);
  const mapRef = useRef<MapView>(null);
  const { setLocation, location, outOfRange, setOutOfRange } = useUserStore();
  const { emit, on, off } = useWS();
  const MAX_DISTANCE_THRESHOLD = 10000;

  useEffect(() => {
  (async () => {
    if (isFocused) {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === "granted") {
        try {
          const location = await Location.getCurrentPositionAsync({});
          const { latitude, longitude } = location.coords;

          mapRef.current?.fitToCoordinates(
            [{ latitude, longitude }],
            {
              edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
              animated: true,
            }
          );

          const newRegion = {
            latitude,
            longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          };

          handleRegionChangeComplete(newRegion);

        } catch (error) {
          console.error("Error getting current location:", error);
        }
      } else {
        console.log("Permission to access location was denied");
      }
    }
  })();
}, [mapRef, isFocused]);

// real time near by drivers

// useEffect(() => {
//   if (location?.latitude && location?.longitude && isFocused) {
//     emit("subscribeToZone", {
//       latitude: location.latitude,
//       longitude: location.longitude,
//     });

//     on("nearbyriders",(riders:any[])=>{
//       const updatedMarkers=riders.map((rider)=>({
//       id: rider.id,
//       latitude: rider.coords.latitude,
//       longitude: rider.coords.longitude,
//       type : "rider",
//       rotation:rider.coords.heading,
//       visible:true,
//       }))
//       setMarkers(updatedMarkers)
//     })
//   }
//   return ()=>{off("nearbyriders");}
// }, [location, emit, on, off, isFocused]);

// random service driver locations 

const generateRandomMarkers = () => {
  if (!location?.latitude || !location?.longitude || outOfRange) return;

  const types = ['Ambulance', 'Firebrigade', 'NGO'];

  const newMarkers = Array.from({ length: 20 }, (_, index) => {
    const randomType = types[Math.floor(Math.random() * types.length)];
    const randomRotation = Math.floor(Math.random() * 360);

    return {
      id: index,
      latitude: location?.latitude + (Math.random() - 0.5) * 0.01,
      longitude: location?.longitude + (Math.random() - 0.5) * 0.01,
      type: randomType,
      rotation: randomRotation,
      visible: true,
    };
  });
  setMarkers(newMarkers);
};

  useEffect(() => {
    generateRandomMarkers();
  }, [location])
  

  const handleRegionChangeComplete = async (newRegion: Region) => {
    const address = await reverseGeocode(
      newRegion.latitude,
      newRegion.longitude
    );
    setLocation({
      latitude: newRegion.latitude,
      longitude: newRegion.longitude,
      address: address,
    });

    const userlocation = {
      latitude: location?.latitude,
      longitude: location?.longitude
    } as any;
    if (userlocation) {
      const newLocation = {
        latitude: newRegion.latitude,
        longitude: newRegion.longitude,
      };
      const distance = haversine(userlocation, newLocation);
      setOutOfRange(distance > MAX_DISTANCE_THRESHOLD);
    }
  }


  const handleGpsButtonPress = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      mapRef.current?.fitToCoordinates([{ latitude, longitude }], {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
      const address = await reverseGeocode(latitude, longitude);
      setLocation({ latitude, longitude, address });
    } catch (error) {
      console.error("error getting location :", error);
    }
  };

  return (
    <View style={{ height: height, width: "100%" }}>
      <MapView
        ref={mapRef}
        maxZoomLevel={16}
        minZoomLevel={12}
        pitchEnabled={false}
        onRegionChangeComplete={handleRegionChangeComplete}
        style={{flex:1}}
        initialRegion={indiaIntialRegion}
        // provider='google'
        provider={undefined}
        showsMyLocationButton={false}
        showsCompass={false}
        showsIndoors={false}
        showsIndoorLevelPicker={false}
        showsTraffic={false}
        showsScale={false}
        showsBuildings={false}
        showsPointsOfInterests={false}
        customMapStyle={customMapStyle}
        showsUserLocation={true}
        >
          {
            markers?.filter((marker:any)=>marker?.latitude && marker?.longitude && marker?.visible).map((marker:any, index:number)=>(
              <Marker key={index} zIndex={index+1} flat anchor={{x:0.5,y:0.5}} coordinate={{latitude:marker.latitude, longitude:marker?.longitude}}>

              <View style={{transform:[{rotate: `${marker?.rotaion}deg`}]}}>
                  <Image source={
                    marker.type==="Ambulance" ? require("@/assets/icons/amb_marker.png") 
                    : marker.type==="Firebrigade" ? require("@/assets/icons/fire_marker.png") :
                    require("@/assets/icons/cab_marker.png") 
                  }
                  style={{height:40,width:40, resizeMode:"contain"}}
                  />
              </View>
              </Marker>
            ))
          }
</MapView>
      <View style={mapStyles.centerMarkerContainer}>
        <Image source={require("@/assets/icons/marker.png")} style={mapStyles.marker} />
      </View>
      <TouchableOpacity style={mapStyles.gpsButton} onPress={handleGpsButtonPress}>
        <MaterialCommunityIcons
          name='crosshairs-gps'
          size={RFValue(16)}
          color="#3C75BE" />

      </TouchableOpacity>

      {
        outOfRange && (
          <View style={mapStyles.outOfRange}>
            <FontAwesome6
              name="road-circle-exclamation"
              size={24}
              color="red"
            />
          </View>
        )
      }

    
    </View >
  )
}

export default memo(DraggableMap) 