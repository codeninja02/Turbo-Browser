import React, {useState, useEffect} from 'react';
import { Text, View, Image, TouchableNativeFeedback, FlatList, TouchableOpacity } from 'react-native';
import IonicIcon from 'react-native-vector-icons/Ionicons';
import styles from "../styles/HomeStyle.js";

export default function SearchItem({searchValue, searchItems, openOutlineHandle, openWebsiteHandle}) {

  const [searchINValue, setSearchINValue] = useState(searchValue);
  const [arrayToShow, setArrayToShow] = useState(searchItems);

  const [filArrayToShow, setFilArrayToShow] = useState(searchItems);

  function filterByValue(array, string) {
    try {
      return array.filter(element => element.item.includes(string));
    } catch (err) {
      return arrayToShow;
    }
  }

  useEffect(() => {
    setSearchINValue(searchValue);
    setFilArrayToShow(filterByValue(arrayToShow, searchINValue));
  }, [searchValue]);

  return (
    <View>
      <View>
      {
        searchINValue.length == 0 ?
        arrayToShow.slice(0, 3).map((item, index) => {
          return (
          <View key={item.key} style={styles.searchItemsBB_CON_1}>

            <View>
              <IonicIcon style={styles.searchItemsBB_1_A} name="search-outline"/>
            </View>

            <View style={styles.searchItemsBB_1_B_CON}>
            <TouchableOpacity onPress={() => {openWebsiteHandle(item.item)}}>
              <Text style={styles.searchItemsBB_1_B}>
                {item.item.trim()}
              </Text>
            </TouchableOpacity>
            </View>

            <View>
            <TouchableOpacity onPress={() => {openOutlineHandle(item.item)}}>
              <IonicIcon style={styles.searchItemsBB_1_C} name="open-outline"/>
            </TouchableOpacity>
            </View>

          </View>
          )
        }) :
        filArrayToShow.slice(0, 3).map((item, index) => {
          return (
          <View key={item.key} style={styles.searchItemsBB_CON_1}>

            <View>
              <IonicIcon style={styles.searchItemsBB_1_A} name="search-outline"/>
            </View>

            <View style={styles.searchItemsBB_1_B_CON}>
            <TouchableOpacity onPress={() => {openWebsiteHandle(item.item)}}>
              <Text style={styles.searchItemsBB_1_B}>
                {item.item.trim()}
              </Text>
            </TouchableOpacity>
            </View>

            <View>
            <TouchableOpacity onPress={() => {openOutlineHandle(item.item)}}>
              <IonicIcon style={styles.searchItemsBB_1_C} name="open-outline"/>
            </TouchableOpacity>
            </View>

          </View>
          )
        })
      }
      </View>
    </View>
  )
}
