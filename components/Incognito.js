import React, { useState, useRef, useEffect } from 'react';
import { StatusBar, SafeAreaView, Text, View, Image, ScrollView, TouchableNativeFeedback, TouchableOpacity, Animated, ActivityIndicator, TextInput, BackHandler } from 'react-native';

import styles from "./styles/IncognitoStyle.js";

import IonicIcon from 'react-native-vector-icons/Ionicons';

import NewsItemDark from './subComponents/NewsItemDark';

import Modal from 'react-native-modalbox';
import SpeechToText from 'react-native-google-speech-to-text';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import { useSelector } from 'react-redux';

const Incognito = ({ navigation }) => {

  // ["#1C2124FF", "#FFFFFFFF"]
  const styleTypes = ['default','dark-content', 'light-content'];
  const [statusColor, setStatusColor] = useState("#FFFFFFFF");
  const [styleStatusBar, setStyleStatusBar] = useState(styleTypes[1]);
  
  const [rippleOverflow, setRippleOverflow] = useState(false);

  const scrollRef = useRef();

  const fadeAnim1 = useRef(new Animated.Value(0)).current;
  const transformAnim = useRef(new Animated.Value(-16)).current;
  const rotateAnim1 = useRef(new Animated.Value(0)).current;
  const [showMoreStatus, setShowMoreStatus] = useState(false);
  const [showMoreDisp, setShowMoreDisp] = useState(false);

  const [newsData, setNewsData] = useState(false);

  const [searchOpen, setSearchOpen] = useState(false);
  const view1marTop1 = useRef(new Animated.Value(0)).current;
  const bottomViewsAll2 = useRef(new Animated.Value(1)).current;
  
  const translY = useRef(new Animated.Value(0)).current;

  const [searchValue, setSearchValue] = useState("");

  const searchItemsBBo2 = useRef(new Animated.Value(0)).current;
  const [optionsAlertOpen, setOptionsAlertOpen] = useState(false);

  const appInfo = useSelector((state) => state.appInfo);

  const speechToTextHandler = async () => {
    let speechToTextData = null;
    try {
      speechToTextData = await SpeechToText.startSpeech('Try saying something', 'en_IN');
      searchString(speechToTextData);

    } catch (error) {
      // error
    }
  }

  Array.prototype.insert = function ( index, item ) {
    this.splice( index, 0, item );
  };

  const spin = rotateAnim1.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg']
  });

  const scrollToTop = () => {
    scrollRef.current.scrollTo({
        y: 0,
        animated: true,
    });
  }

  function showMoreClick(){

    if(showMoreStatus == false){

      setShowMoreDisp(true);
      Animated.timing(
        fadeAnim1,
        {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }
      ).start();
      setShowMoreStatus(true);
      Animated.timing(
        transformAnim,
        {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }
      ).start();
      Animated.timing(
        rotateAnim1,
        {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }
      ).start();

      if(newsData  == false){

        fetch("https://api.nytimes.com/svc/topstories/v2/home.json?api-key=S54qP2LGkkPqRMJNbH3GhacbATsuLsh7", {
          method: 'get',
        })
        .then(response => {
          return response.json();
        })
        .then(json => {
          if(json.status == "OK"){
            setNewsData(json);
          }
        })
        .catch(error => {
          // Close ShowMore
          Animated.timing(
            fadeAnim1,
            {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }
          ).start();
          setShowMoreStatus(false);
          Animated.timing(
            transformAnim,
            {
              toValue: -16,
              duration: 200,
              useNativeDriver: true,
            }
          ).start();
          Animated.timing(
            rotateAnim1,
            {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }
          ).start();
        });

      } else {
        
      }

    } else {

      Animated.timing(
        fadeAnim1,
        {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }
      ).start();
      setShowMoreStatus(false);
      Animated.timing(
        transformAnim,
        {
          toValue: -16,
          duration: 200,
          useNativeDriver: true,
        }
      ).start();
      Animated.timing(
        rotateAnim1,
        {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }
      ).start();

      scrollToTop();
      setTimeout(() => {
        setShowMoreDisp(false);
      }, 200);

    }

  }

  const searchBarClicked1 = () => {
    setSearchValue("");
    setSearchOpen(true);
    scrollToTop();
    Animated.timing(
      translY,
      {
        toValue: -170,
        duration: 200,
        useNativeDriver: true,
      }
    ).start();
    Animated.timing(
      bottomViewsAll2,
      {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }
    ).start();
    setTimeout(() => {
      Animated.timing(
        searchItemsBBo2,
        {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }
      ).start();
    }, 200);
  }

  const closeSearchBtn = () => {
    setSearchOpen(false);
    Animated.timing(
      translY,
      {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }
    ).start();
    Animated.timing(
      bottomViewsAll2,
      {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }
    ).start();
    Animated.timing(
      searchItemsBBo2,
      {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }
    ).start();
  }

  const openWebsite = (url) => {
    
    navigation.navigate('IncognitoSearch', { name: `turbo/${url}` });  

    setTimeout(() => {
      setSearchOpen(false);
      Animated.timing(
        translY,
        {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }
      ).start();
      Animated.timing(
        bottomViewsAll2,
        {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }
      ).start();
    }, 400);
    
  }

  const onSearchChangeText = (text) => {
    setSearchValue(text);
  }

  const voiceSearchBtnClk = () => {
    speechToTextHandler();
  }

  const openNews = (url) => {
    openWebsite(url);
  }

  const showMoreBtnClk = () => {
    openWebsite("https://news.google.com/");
  }

  const searchString = (string) => {

    if(string == ""){

    } else if (string.substring(0, 8) == "https://" || string.substring(0, 7) == "http://") {
      if(string.includes("~")){
        openWebsite(string);
      } else {
        openWebsite(string);
      }
    } else {

      if(string.includes("~")){
        openWebsite("https://duckduckgo.com/?q=" + string.replace(/ /g,"+"));
      } else {
        openWebsite("https://duckduckgo.com/?q=" + string.replace(/ /g,"+"));
      }

    }

  }

  useEffect(() => {

    navigation.addListener('focus',
    () => {

      setStyleStatusBar(styleTypes[2]);
      setStatusColor("#1C2124FF");
      // setTimeout(() => {
      //   setStyleStatusBar(styleTypes[2]);
      //   setStatusColor("#1C2124FF");
      // }, 400);
      changeNavigationBarColor("#1C2124", false, true);
    }
    );

    navigation.addListener('blur',
      () => {
        setStyleStatusBar(styleTypes[1]);
        setStatusColor("#FFFFFFFF");
        changeNavigationBarColor("#FFFFFF", true, true);
      }
    );

  }, []);

  return(
    <SafeAreaView>

    <StatusBar backgroundColor={statusColor} barStyle={styleStatusBar} />

    <Modal
      isOpen={optionsAlertOpen} 
      onClosed={() => {setOptionsAlertOpen(false)}} 
      style={[styles.modal, styles.modal8]} 
      position={"bottom"} 
      backdropPressToClose={true} 
      swipeToClose={false}
      backdropOpacity={0.6} 
      backButtonClose={true}
      coverScreen={false} 
      animationDuration={200}
      transparent={true}
    >
      <View style={styles.optionAlertCont_MAIN}>

      <View style={styles.optionAlertCont_opt_1}>
          <TouchableOpacity onPress={() => {
            setOptionsAlertOpen(false);
            navigation.navigate('Home', { name: "Incognito" });
          }}>
            <Text style={styles.optionAlertCont_optText_1}>
              Close Incognito
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.optionAlertCont_opt_1}>
          <TouchableOpacity onPress={() => {
            setOptionsAlertOpen(false);
            navigation.navigate('Settings', { name: "Incognito" });
          }}>
            <Text style={styles.optionAlertCont_optText_1}>
              Settings
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.optionAlertCont_opt_1}>
          <TouchableOpacity onPress={() => {
            setOptionsAlertOpen(false);
            openWebsite("https://turbo-browser.netlify.app/privacy-policy.html");
          }}>
            <Text style={styles.optionAlertCont_optText_1}>
              Privacy Policy
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
              source={require("../assets/arrowDown2Dark.png")} 
              style={{
                height: 26,
                width: 26,
              }}
            />
          </TouchableOpacity>
        </View>
        
      </View>
    </Modal>

    <ScrollView ref={scrollRef} style={styles.scrollView} scrollEnabled={!searchOpen} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'handled'} scrollEventThrottle={1}>

    <Animated.View
      style={{
        translateY: translY
      }}
    >

      {/* View 1 */}
      <Animated.View
        style={{
          marginTop: view1marTop1
        }}
      >
      <View style={styles.view__1}>
        <View style={styles.view__1_img_bg}>
          <Image
            source={require('../assets/incognitoDark.png')} 
            style={{ resizeMode: 'contain', width: 40, height: 40 }}
          />
        </View>
      </View>
      </Animated.View>

      <View style={{
        position: "absolute",
        right: 20,
        top: 20,
        height: 32,
        width: 32,
        backgroundColor: "#161B1DFE",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 32
      }}>
      <TouchableOpacity onPressIn={() => {
        setOptionsAlertOpen(true);
      }}>
        <View style={{
          height: 32,
          width: 32,
          backgroundColor: "#161B1DFE",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 32
        }}>
          <IonicIcon style={{
            color: "#575d62",
            fontSize: 16,
          }} name="ellipsis-vertical"/>
        </View>
      </TouchableOpacity>
      </View>

      {/* View 2 */}
      <View style={styles.view__2}>

        <View style={{borderRadius: 40, overflow: 'hidden'}}>

        <TouchableOpacity
          onPress={searchBarClicked1}
          style={{width: "100%"}}
        >

        <View style={styles.view_input_c_1}>

          {
            searchOpen
            ?
            <IonicIcon onPress={closeSearchBtn} style={styles.search_icon} name="arrow-back"/>
            :
            <IonicIcon style={styles.search_icon} name="search"/>
          }

          {
            searchOpen ?
            <TextInput 
              style={{
                fontSize: 14,
                color: "#b1b1b1",
                marginLeft: 8,
                fontFamily: "Helvetica",
                flexGrow: 1,
              }}
              value={searchValue}
              onChangeText={(text) => onSearchChangeText(text)}
              autoFocus={true}
              editable={searchOpen}
              onSubmitEditing={() => searchString(searchValue)}
              placeholderTextColor="#CECFCFFF"
            />
            :
            <Text style={styles.search_text}>Search DuckDuckGo</Text>
          }
          {/* setSearchValue */}
          { searchOpen ?
          ((searchValue.length > 0) ? <IonicIcon onPress={() => setSearchValue("")} style={styles.mic_icon} name="close"/> : <IonicIcon onPress={voiceSearchBtnClk} style={styles.mic_icon} name="mic"/>)
          :
          <IonicIcon onPress={voiceSearchBtnClk} style={styles.mic_icon} name="mic"/>
          }

        </View>

        </TouchableOpacity>

        </View>

      </View>

      <Animated.View
        style={{
          opacity: bottomViewsAll2
        }}
      >

      {/* View 5 */}
      <View style={styles.view_5}>
          <View style={styles.view_5_ic_1}>
              <TouchableNativeFeedback
                onPress={showMoreClick}
                background={TouchableNativeFeedback.Ripple("#2F3A3BFE", rippleOverflow)}
              >
              <View style={styles.view_5_ic_2}>
              <Text style={styles.view_5_txt}>
                Show more
              </Text>
              <Animated.View
                style={{
                  transform: [{rotate: spin}],
                }}
              ><IonicIcon style={styles.view_5_icon} name="chevron-down"/></Animated.View>
              </View>
              </TouchableNativeFeedback>
          </View>
      </View>
      
      <Text style={styles.incogText_B}>
        Turbo doesn’t remember what you do in a Private Window. Sites you visit won't show up in your history, and downloads and bookmarks are disabled.
      </Text>
      
      {showMoreDisp ?
        <View>
        <Animated.View
          style={{
            opacity: fadeAnim1,
            translateY: transformAnim,
          }}
        >
          {newsData ?
            <View>
            <NewsItemDark openNew={openNews} item={newsData.results[0]}/>
            <NewsItemDark openNew={openNews} item={newsData.results[1]}/>
            <NewsItemDark openNew={openNews} item={newsData.results[2]}/>
            <NewsItemDark openNew={openNews} item={newsData.results[3]}/>
            <NewsItemDark openNew={openNews} item={newsData.results[4]}/>
            <NewsItemDark openNew={openNews} item={newsData.results[5]}/>
            <TouchableOpacity
              onPress={showMoreBtnClk}
            >
            <View style={styles.browserMore__1}>
              <Text style={styles.browserMore__2}>Browse More</Text>
            </View>
            </TouchableOpacity>
            </View>
          :
          <View style={styles.loaderContainerAA}>
            <ActivityIndicator color={'#b1b1b1'} />
          </View>
          }
        </Animated.View>
        </View>
      : <View></View>
      }

      </Animated.View>

    </Animated.View>

    </ScrollView>

    </SafeAreaView>
  )

}

export default Incognito;