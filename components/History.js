import React, { useState, useRef, useEffect } from 'react';
import { StatusBar, SafeAreaView, Text, View, Image, ScrollView, TouchableNativeFeedback, TouchableOpacity, Animated, ActivityIndicator, TextInput, Keyboard, Button, BackHandler, ToastAndroid } from 'react-native';
import 'react-native-gesture-handler';

import IonicIcon from 'react-native-vector-icons/Ionicons';

import styles from "./styles/HistoryStyle.js";

import Modal from 'react-native-modalbox';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LottieView from 'lottie-react-native';

const History = ({ navigation, route }) => {
  
  const styleTypes = ['default','dark-content', 'light-content'];
  const [styleStatusBar, setStyleStatusBar] = useState(styleTypes[1]);

  const [rippleOverflow, setRippleOverflow] = useState(false);

  const [optionsAlertOpen, setOptionsAlertOpen] = useState(false);

  const [searchValue, setSearchValue] = useState("");
  const [filtereHistoryList, setFiltereHistoryList] = useState([null]);

  const [historyValue, setHistoryValue] = useState([null]);
  const [searchVisible, setSearchVisible] = useState(false);

  const lottieOpacity = useRef(new Animated.Value(1)).current;

  const showToast = () => {
    ToastAndroid.show("History cleared", ToastAndroid.SHORT);
  };

  const se1 = () => {
    navigation.goBack();
  }

  const se2 = () => {
    navigation.navigate('Incognito', { name: "Incognito" });
  }

  const se3 = () => {
    navigation.navigate('Home', { name: "Home" });
  }

  const se4 = async () => {
    try {
      await AsyncStorage.removeItem("historyKey");
      setHistoryValue([null]);
      setTimeout(() => {
        Animated.timing(
          lottieOpacity,
          {
            toValue: 0,
            duration: 10,
            useNativeDriver: true,
          }
        ).start();
        setTimeout(() => {
          Animated.timing(
            lottieOpacity,
            {
              toValue: 1,
              duration: 400,
              useNativeDriver: true,
            }
          ).start();
        }, 20);
      }, 100);
    } catch (error) {
      // error
    }
    showToast();
  }

  const se5 = () => {
    setOptionsAlertOpen(true);
  }

  useEffect(() => {
    Keyboard.addListener("keyboardDidShow", _keyboardDidShow);
    Keyboard.addListener("keyboardDidHide", _keyboardDidHide);

    // cleanup function
    return () => {
      Keyboard.removeListener("keyboardDidShow", _keyboardDidShow);
      Keyboard.removeListener("keyboardDidHide", _keyboardDidHide);
    };
  }, []);

  const _keyboardDidShow = () => {
    Animated.timing(
      lottieOpacity,
      {
        toValue: 0,
        duration: 10,
        useNativeDriver: true,
      }
    ).start();
  };

  const _keyboardDidHide = () => {
    setSearchValue("");
    setTimeout(() => {
      Animated.timing(
        lottieOpacity,
        {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }
      ).start();
    }, 100);
  };

  function remove_duplicates(arr) {
    var obj = {};
    var ret_arr = [];
    for (var i = 0; i < arr.length; i++) {
        obj[arr[i]] = true;
    }
    for (var key in obj) {
        ret_arr.push(key);
    }
    return ret_arr;
  }

  function filterByValue(array, string) {
    return array.filter(element => element.includes(string.toLowerCase()));
  }

  const getHistoryValue = async () => {
    try {
      const value = await AsyncStorage.getItem("historyKey");
      if(value !== null) {
        setHistoryValue(remove_duplicates(value.split("~")));
      }
    } catch(error) {
      // error
    }
  }

  useEffect(() => {
    navigation.addListener('focus',
    () => {
      getHistoryValue();
    }
    );
  }, []);

  const openWebsite = (url) => {
    navigation.navigate('Search', { name: `turbo/${url}` });  
  }

  const searchSubmitted = (searchString) => {
    setSearchVisible(false);
  }

  useEffect(() => {
    setSearchValue(searchValue);
    if(historyValue[0] !== null) {
      setFiltereHistoryList(filterByValue(historyValue, searchValue));
    }
    // setFiltereHistoryList(filterByValue(historyValue, searchValue));
  }, [searchValue]);

  const onSearchChangeText = async (text) => {
    setSearchValue(text);
  }

  return (
    <SafeAreaView>
    <StatusBar backgroundColor="#ffffff" barStyle={styleStatusBar} />

    <Modal
      isOpen={optionsAlertOpen} 
      onClosed={() => {setOptionsAlertOpen(false)}} 
      style={[styles.modal, styles.modal8]} 
      position={"bottom"} 
      backdropPressToClose={true} 
      swipeToClose={false}
      backdropOpacity={0.2} 
      backButtonClose={true}
      coverScreen={true} 
      animationDuration={200}
    >
      <View style={styles.optionAlertCont_MAIN}>

        <View style={styles.optionAlertCont_opt_1}>
          <TouchableOpacity onPress={() => {
            setOptionsAlertOpen(false);
            navigation.navigate('Bookmarks', { name: "History" });
          }}>
            <Text style={styles.optionAlertCont_optText_1}>
              Bookmarks
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.optionAlertCont_opt_1}>
          <TouchableOpacity onPress={() => {
            setOptionsAlertOpen(false);
            navigation.navigate('Settings', { name: "History" });
          }}>
            <Text style={styles.optionAlertCont_optText_1}>
              Settings
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.optionAlertCont_opt_1}>
          <TouchableOpacity onPress={() => {
            setOptionsAlertOpen(false);
            navigation.navigate('Help', { name: "History" });
          }}>
            <Text style={styles.optionAlertCont_optText_1}>
              FAQs
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.optionAlertCont_opt_1_B}>
          <TouchableOpacity onPress={() => {
            BackHandler.exitApp();
          }}>
            <Text style={styles.optionAlertCont_optText_1}>
              Exit App
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.optionAlertCont_opt_icon_1}>
          <TouchableOpacity style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            paddingBottom: 10,
            marginBottom: 4,
          }} onPress={() => {setOptionsAlertOpen(false)}}>
            {/* <FontAwesome style={styles.optionAlertCont_opt_icon_2} name="chevron-down"/> */}
            <Image 
              source={require("../assets/arrowDown2.png")} 
              style={{
                height: 26,
                width: 26,
              }}
            />
          </TouchableOpacity>
        </View>
        
      </View>
    </Modal>

    <View style={styles.historyMainContainer}>

      <View style={styles.history_title_1}>
        {
          searchVisible ?
          <>
          <View style={styles.history1_INPUT_C}>
            <TextInput 
              style={{
                color: "#767474FE",
                fontSize: 16,
                fontFamily: "Helvetica",
                marginLeft: 20,
                flexGrow: 1,
                marginTop: -10,
                paddingTop: -10,
                marginBottom: -10,
                paddingBottom: -10,
                maxWidth: 240,
              }}
              value={searchValue}
              onChangeText={(text) => onSearchChangeText(text)}
              autoFocus={true}
              editable={searchVisible}
              onSubmitEditing={() => {searchSubmitted(searchValue)}}
              placeholderTextColor="#CECFCFFF"
              placeholder="Search History"
            />
          </View>
          </>
          :
          <>
          <TouchableOpacity onPress={() => {navigation.goBack()}}>
          <View style={styles.history1_AA}>
            <IonicIcon name="arrow-back" style={styles.history_title_1A_icon}/>
          </View>
          </TouchableOpacity>
          <View style={styles.history1_BB}>
            <Text style={styles.history_title_1B_txt}>History</Text>
          </View>
          </>
        }
        {
          searchVisible ?
          <>
          <TouchableOpacity onPress={() => {
          setSearchVisible(!searchVisible);
          }}>
            <View style={styles.history1_CC}>
              <IonicIcon name="close" style={styles.history_title_1C_icon}/>
            </View>
          </TouchableOpacity>
          </>
          :
          <>
          <TouchableOpacity onPress={() => {
          setSearchVisible(!searchVisible);
          }}>
            <View style={styles.history1_CC}>
              <IonicIcon name="search" style={styles.history_title_1C_icon}/>
            </View>
          </TouchableOpacity>
          </>
        }
      </View>
      <LinearGradient colors={['#EDEEEEFE', '#FFFFFFFF']} style={styles.linearGradient_1}></LinearGradient>

      <View style={styles.history_style_2}>

        {
          searchVisible ?
          <>
            {
              filtereHistoryList.map((value, index) => {
                return (
                  <View style={styles.his_s22_A} key={index}>
                    <TouchableNativeFeedback
                      background={TouchableNativeFeedback.Ripple("#BBB9B9FE", rippleOverflow)}
                      onPress={() => {
                        openWebsite(value);
                      }}
                    >
                      <View style={styles.his_s22_B}>
                        <Text style={styles.his_s22_C_TXT}>{value}</Text>
                      </View>
                    </TouchableNativeFeedback>
                  </View>
                )
              })
            }
          </>
          :
          <>
            {
              historyValue[0] == null ?
              <>
              <View style={styles.lottieViewContainer}>
              <Animated.View
                style={{
                  opacity: lottieOpacity
                }}
              >
              <LottieView
                  style={styles.lottieAnimation}
                  source={require('../assets/629-empty-box.json')}
                  autoSize={true}
                  autoPlay
                  loop
                />
                <Text style={styles.lottieText}>Your browsing history appears here</Text>
                </Animated.View>
              </View>
              </>
              :
              <>
                {
                  historyValue.map((value, index) => {
                    return (
                      <View style={styles.his_s22_A} key={index}>
                        <TouchableNativeFeedback
                          background={TouchableNativeFeedback.Ripple("#BBB9B9FE", rippleOverflow)}
                          onPress={() => {
                            openWebsite(value);
                          }}
                        >
                          <View style={styles.his_s22_B}>
                            <Text style={styles.his_s22_C_TXT}>{value}</Text>
                          </View>
                        </TouchableNativeFeedback>
                      </View>
                    )
                  })
                }
              </>
            }
          </>
        }

        {/* <View style={styles.his_s22_A}>
          <TouchableNativeFeedback
            background={TouchableNativeFeedback.Ripple("#BBB9B9FE", rippleOverflow)}
            onPress={() => {
              openWebsite("https://github.com/lottie-react-native/lottie-react-native#readme");
            }}
          >
            <View style={styles.his_s22_B}>
              <Text style={styles.his_s22_C_TXT}>Hello world</Text>
            </View>
          </TouchableNativeFeedback>
        </View> */}

      </View>

      <View style={styles.history_style_3}>

        <TouchableOpacity onPress={se1} style={styles.sea_3_item}>
          <View>
            <IonicIcon style={styles.sea3__3_icon} name="arrow-back"/>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={se2} style={styles.sea_3_item}>
          <View style={{
            display: "flex",
            alignItems: "center",
          }}>
            <Image style={styles.sea3__3_icon_img} source={require("../assets/incognito.png")} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={se3} style={styles.sea_3_item}>
          <View>
            <IonicIcon style={styles.sea3__3_icon} name="home-outline"/>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={se4} style={styles.sea_3_item}>
          <View>
            <IonicIcon style={styles.sea3__3_icon} name="trash-outline"/>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={se5} style={styles.sea_3_item}>
          <View>
            <IonicIcon style={styles.sea3__3_icon} name="grid-outline"/>
          </View>
        </TouchableOpacity>

      </View>
    
    </View>
    </SafeAreaView>
  );

}

export default History;