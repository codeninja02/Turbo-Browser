import React, { useState, useRef, useEffect } from 'react';
import { StatusBar, SafeAreaView, Text, View, Image, TouchableNativeFeedback, TouchableOpacity, Animated, ActivityIndicator, Share, ToastAndroid, Keyboard, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WebView } from 'react-native-webview';
import 'react-native-gesture-handler';

import IonicIcon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import styles from "./styles/SearchStyle.js";

import Modal from 'react-native-modalbox';
import Clipboard from '@react-native-clipboard/clipboard';
import SpeechToText from 'react-native-google-speech-to-text';

import { useSelector } from 'react-redux';

const Search = ({ navigation, route }) => {

  const styleTypes = ['default','dark-content', 'light-content'];
  const [styleStatusBar, setStyleStatusBar] = useState(styleTypes[1]);

  const [rippleOverflow, setRippleOverflow] = useState(false);

  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");

  const [WebL, setWebL] = useState(true);
  const [cUrl, setCUrl] = useState((route.params.name).replace("turbo/", ""));
  const [httpS, setHttpS] = useState(2);
  const [favIcon, setFavIcon] = useState("");
  const [webTS, setWebTS] = useState((route.params.name).replace("turbo/", "").split("/")[2] > 26 ? cUrl.split("/")[2].substring(0, 24) + "..." : cUrl.split("/")[2]);
  const [titleCurrent, setTitleCurrent] = useState("");

  const [webViewShow, setWebViewShow] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [f2, setF2] = useState(false);

  const BottomNavOpacity = useRef(new Animated.Value(1)).current;

  const [optionsAlertOpen, setOptionsAlertOpen] = useState(false);
  const [copiedText, setCopiedText] = useState('');

  const [searchAlertOpen, setSearchAlertOpen] = useState(false);

  const INJECTEDJAVASCRIPT = `
  const meta = document.createElement('meta'); meta.setAttribute('content', 'initial-scale=1.0, maximum-scale=1.0'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta);
  
  var links = document.links, i, length;
  for (i = 0, length = links.length; i < length; i++) {
      links[i].target == '_blank' && links[i].removeAttribute('target');
  }
  
  window.ReactNativeWebView.postMessage(document.title);
  `;

  const inputRef = React.useRef();
  const webviewRef = useRef(null);

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const [bookmarksKeyValue, setBookmarksKeyValue] = useState("");

  const appInfo = useSelector((state) => state.appInfo);

  useEffect(() => {
    Keyboard.addListener("keyboardDidShow", _keyboardDidShow);
    Keyboard.addListener("keyboardDidHide", _keyboardDidHide);

    // cleanup function
    return () => {
      Keyboard.removeListener("keyboardDidShow", _keyboardDidShow);
      Keyboard.removeListener("keyboardDidHide", _keyboardDidHide);
    };
  }, []);

  const speechToTextHandler = async () => {
    let speechToTextData = null;
    try {
      speechToTextData = await SpeechToText.startSpeech('Try saying something', 'en_IN');
      searchStringS(speechToTextData);
    } catch (error) {
      // error
    }
  }

  const _keyboardDidShow = () => {
    if(route.name == "Search"){
      setF2(true);
    } else {
      // Do nothing
    }
  };

  const _keyboardDidHide = () => {
    if(route.name == "Search"){
      setF2(false);
    } else {
      // Do nothing
    }
  };

  const showToast = () => {
    ToastAndroid.show("URL copied", ToastAndroid.SHORT);
  };

  useEffect(() => {
    setTimeout(() => {
      setWebViewShow(true);
    }, 600);
  }, []);

  const se1 = () => {
    if (webviewRef.current){
      if(canGoBack) {
        webviewRef.current.goBack();
      } else {
        navigation.goBack();
      }
    }
  }

  const se2 = () => {
    if (webviewRef.current) webviewRef.current.goForward();
  }

  const se3 = () => {
    navigation.navigate('Home', { name: "Home" });
  }

  const setHttpIcon = () => {
    if(cUrl.substring(0, 5) == "https") {
      setHttpS(1);
    } else if (cUrl.substring(0, 5) == "http:") {
      setHttpS(2);
    } else {
      setHttpS(3);
    }
  }

  const getBookmarkValue = async () => {
    try {
      const value = await AsyncStorage.getItem("bookmarksKey")
      if(value !== null) {
        // value previously stored
        setBookmarksKeyValue(value);
      } else {
        setBookmarksKeyValue("");
      }
    } catch(e) {
      // error
    }
  }

  const saveBookmarkValue = async () => {
    try {
      const value = await AsyncStorage.getItem("bookmarksKey")
      if(value !== null) {
        // value previously stored
        await AsyncStorage.setItem("bookmarksKey", value + "~" + currentUrl);
        setBookmarksKeyValue(value + "~" + currentUrl);
      } else {
        await AsyncStorage.setItem("bookmarksKey", currentUrl + "~");
        setBookmarksKeyValue(currentUrl + "~");
      }
    } catch(e) {
      // error
    }
  }

  useEffect(() => {
    navigation.addListener('focus',
    () => {

      let urlToOpen = (route.params.name).replace("turbo/", "");
      setCurrentUrl(urlToOpen);

      setWebTS(urlToOpen.split("/")[2] > 26 ? cUrl.split("/")[2].substring(0, 24) + "..." : cUrl.split("/")[2]);
      setHttpS(2);
      setF2(false);

      getBookmarkValue();

    }
    );
  }, []);

  const refreshWeb = () => {
    if (webviewRef.current) webviewRef.current.reload();
  }

  const onMessage = async (message) => {
    setTitleCurrent(message.nativeEvent.data);
    if(message.nativeEvent.data !== ""){
      let objectToSet = {
        name: message.nativeEvent.data,
        url: message.nativeEvent.url
      }
      let valueToSet = JSON.stringify(objectToSet);
      await AsyncStorage.setItem("lastSearchedWeb", valueToSet);
    }
  }

  const handleFullScrTouch = () => {
    if(fullscreen){
      setFullscreen(false);
      Animated.timing(
        BottomNavOpacity,
        {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }
        ).start();
      setTimeout(() => {
        Animated.timing(
          BottomNavOpacity,
          {
            toValue: 1,
            duration: appInfo.animations == false ? 0 : 200,
            useNativeDriver: true,
          }
          ).start();
      }, 200);
    } else {
      setFullscreen(true);
      Animated.timing(
      BottomNavOpacity,
      {
        toValue: 0,
        duration: appInfo.animations == false ? 0 : 100,
        useNativeDriver: true,
      }
      ).start();
    }
  }

  const se4 = () => {
    saveBookmarkValue();
  }

  const se5 = () => {
    setOptionsAlertOpen(true);
  }

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: currentUrl,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      // error
    }
  };

  const copyToClipboard = () => {
    Clipboard.setString(currentUrl);
  };

  const onSearchChangeText = (text) => {
    setSearchValue(text);
  }

  const saveHistory = async () => {
    if(currentUrl !== "about:blank" || currentUrl !== "" || currentUrl.includes("~"))
    try {
      const value = await AsyncStorage.getItem("historyKey");
      if(value !== null) {
        // value previously stored
        if(value.includes("~")){
          await AsyncStorage.setItem("historyKey", currentUrl + "~" + value);
        } else {
          await AsyncStorage.setItem("historyKey", currentUrl + "~" + value);
        }
      } else {
        await AsyncStorage.setItem("historyKey", currentUrl);
      }
    } catch (error) {
      // error
    }
  }

  const searchStringS = (string) => {

    if(string == ""){

    } else if (string.substring(0, 8) == "https://" || string.substring(0, 7) == "http://") {
      setCurrentUrl(string);
    } else {

      // openWebsite("https://www.google.com/search?q=" + string.replace(/ /g,"+"));

      if(appInfo.searchEngine == "Google"){
        setCurrentUrl("https://www.google.com/search?q=" + string.replace(/ /g,"+"));
      } else if (appInfo.searchEngine == "DuckDuckGo") {
        openWebsite("https://duckduckgo.com/?q=" + string.replace(/ /g,"+"));
      } else if (appInfo.searchEngine == "Bing") {
        setCurrentUrl("https://www.bing.com/search?q=" + string.replace(/ /g,"+"));
      } else if (appInfo.searchEngine == "Yahoo!") {
        setCurrentUrl("https://in.search.yahoo.com/search?p=" + string.replace(/ /g,"+"));
      } else {
        setCurrentUrl("https://www.google.com/search?q=" + string.replace(/ /g,"+"));
      }

    }

  }

  const voiceSearchBtnClk = () => {
    speechToTextHandler();
    setSearchAlertOpen(false);
    setSearchOpen(false);
  }

  const se4Remove = async () => {
    try {
      const value = await AsyncStorage.getItem("bookmarksKey");
      const newValue = value.split(currentUrl).join("");
      await AsyncStorage.setItem("bookmarksKey", newValue);
      setBookmarksKeyValue(newValue);
    } catch(e) {
      // error
    }
  }

  return (
    <SafeAreaView>

    <StatusBar backgroundColor="#ffffff" barStyle={styleStatusBar} />

    <Modal
      isOpen={searchAlertOpen}
      onClosed={() => {
        setSearchAlertOpen(false);
        setSearchOpen(false);
      }}
      style={[styles.modal, styles.modal12]} 
      entry={"top"}
      position={"top"} 
      backdropPressToClose={true} 
      swipeToClose={false}
      backdropOpacity={0.4} 
      backButtonClose={true}
      coverScreen={true} 
      animationDuration={200}
    >
      <View style={styles.view__2}>
      <View style={{borderRadius: 40, overflow: 'hidden'}}>
      {/* <TouchableOpacity
      style={{width: "100%"}}
      > */}
      <View style={styles.view_input_c_1}>

      <IonicIcon style={styles.search_icon} name="search"/>

      <TextInput
        ref={inputRef}
        style={{
          // maxWidth: 200,
          fontSize: 14,
          color: "#5B5D5DFF",
          marginLeft: 8,
          fontFamily: "Helvetica",
          flexGrow: 1,
        }}
        value={searchValue}
        onChangeText={(text) => onSearchChangeText(text)}
        autoFocus={true}
        editable={searchOpen}
        onSubmitEditing={() => {
          setSearchAlertOpen(false);
          setSearchOpen(false);
          searchStringS(searchValue);
        }}
        placeholderTextColor="#CECFCFFF"
        placeholder="Search Google"
      />

      {
        searchValue.length > 0 ?
        <IonicIcon onPress={() => setSearchValue("")} style={styles.mic_icon} name="close"/>
        :
        <IonicIcon onPress={voiceSearchBtnClk} style={styles.mic_icon} name="mic"/>
      }

      </View>
      {/* </TouchableOpacity> */}
      </View>
      </View>

    </Modal>

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
            copyToClipboard();
            showToast();
          }}>
            <Text style={styles.optionAlertCont_optText_1}>
              Copy URL
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.optionAlertCont_opt_1}>
          <TouchableOpacity onPress={() => {
            setOptionsAlertOpen(false);
            setTimeout(() => {
              onShare();
            }, 320);
          }}>
            <Text style={styles.optionAlertCont_optText_1}>
              Share
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.optionAlertCont_opt_1}>
          <TouchableOpacity onPress={() => {
            setOptionsAlertOpen(false);
            setCurrentUrl("view-source:" + currentUrl);
          }}>
            <Text style={styles.optionAlertCont_optText_1}>
              View page source
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.optionAlertCont_opt_1}>
          <TouchableOpacity onPress={() => {
            setOptionsAlertOpen(false);
            navigation.navigate('Bookmarks', { name: "Home" });
          }}>
            <Text style={styles.optionAlertCont_optText_1}>
              Bookmarks
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.optionAlertCont_opt_1}>
          <TouchableOpacity onPress={() => {
            setOptionsAlertOpen(false);
            navigation.navigate('History', { name: "Home" });
          }}>
            <Text style={styles.optionAlertCont_optText_1}>
              History
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.optionAlertCont_opt_1}>
          <TouchableOpacity onPress={() => {
            setOptionsAlertOpen(false);
            navigation.navigate('Settings', { name: "Home" });
          }}>
            <Text style={styles.optionAlertCont_optText_1}>
              Settings
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.optionAlertCont_opt_1}>
          <TouchableOpacity onPress={() => {
            setOptionsAlertOpen(false);
            setCurrentUrl("https://turbo-browser.netlify.app/privacy-policy.html");
          }}>
            <Text style={styles.optionAlertCont_optText_1}>
              Privacy Policy
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.optionAlertCont_opt_1_B}>
          <TouchableOpacity onPress={() => {
            setOptionsAlertOpen(false);
            navigation.navigate('Help', { name: "Home" });
          }}>
            <Text style={styles.optionAlertCont_optText_1}>
            FAQs
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

    <View style={styles.searchMainContainer}>
        
      {/* Search 1 */}
      <View style={styles.search_1}>
        {
          currentUrl.includes("view-source:") ?
          <View style={styles.sea1__1}>
          <Image

            style={styles.sea1__1A}

            source={(favIcon.includes("https://api.statvoo.com/favicon/?url=https://www.nytimes.com/") ? require("../assets/ny.png") :

            favIcon.includes("https://api.statvoo.com/favicon/?url=https://www.google.com/") ? require("../assets/googleIcon.png") :

            {uri: favIcon})}
            
          />
          </View>
          :
          <View style={styles.sea1__1}>
            {WebL ?
              <ActivityIndicator size="small" style={{
                height: 16,
                width: 16,
                resizeMode: "cover",
                marginLeft: 8,
                marginRight: 8,
              }} color={'#8F8D8DFE'} />
              :
              <Image

                style={styles.sea1__1A}

                source={(favIcon.includes("https://api.statvoo.com/favicon/?url=https://www.nytimes.com/") ? require("../assets/ny.png") :

                favIcon.includes("https://api.statvoo.com/favicon/?url=https://www.google.com/") ? require("../assets/googleIcon.png") :

                {uri: favIcon})}

              />
            }
          </View>
        }

        <View style={{
          height: 30,
          borderRadius: 30,
          flexGrow: 1,
          overflow: "hidden",
        }}>
        <TouchableNativeFeedback
          background={TouchableNativeFeedback.Ripple("#AEAEAEFF", rippleOverflow)}
          onPress={() => {
            setSearchAlertOpen(true);
            setSearchValue("");
            setTimeout(() => {
              setSearchOpen(true);
              inputRef.current?.focus();
            }, 400);
          }}
        >
          <View style={styles.sea1__2}>
            <View style={styles.sea1__2A}>
              {
                (httpS == 1) ?
                <MaterialIcons style={styles.sea1__2A_icon1} name="https"/>
                : (httpS == 2) ?
                <MaterialIcons style={styles.sea1__2A_icon2} name="https"/>
                : (httpS == 3) ?
                <MaterialIcons style={styles.sea1__2A_icon2} name="https"/>
                : <MaterialIcons style={styles.sea1__2A_icon2} name="https"/>
              }
            </View>
            <View style={styles.sea1__2B}>
              <Text style={styles.sea1__2B_txt}>
                {currentUrl.replace("turbo/", "").split("/")[2] > 26 ? cUrl.split("/")[2].substring(0, 24) + "..." : cUrl.split("/")[2]}
              </Text>
            </View>
            <TouchableOpacity onPress={refreshWeb}>
            <View style={styles.sea1__2C}>
              <MaterialIcons style={styles.sea1__2C_icon} name="replay"/>
            </View>
            </TouchableOpacity>
          </View>
        </TouchableNativeFeedback>
        </View>

        <View style={styles.sea1__3}>
        <TouchableOpacity onPress={handleFullScrTouch}>
          {/* <MaterialIcons style={styles.sea1__3_icon} name="more-vert"/> */}
          {
            fullscreen ?
            <MaterialIcons style={styles.sea1__3_icon} name="fullscreen-exit"/>
            :
            <MaterialIcons style={styles.sea1__3_icon} name="fullscreen"/>
          }
        </TouchableOpacity>
        </View>
      </View>

      {/* Search 2 */}
      <View style={styles.search_2}>
        {
          webViewShow ?
          <WebView
            startInLoadingState={true}
            ref={webviewRef}
            source={{
              uri: currentUrl,
            }}
            onNavigationStateChange={navState => {
              setCanGoBack(navState.canGoBack);
              setCanGoForward(navState.canGoForward);
              setCUrl(navState.url);
              // setWebTS(cUrl.split("/")[2] > 26 ? cUrl.split("/")[2].substring(0, 24) + "..." : cUrl.split("/")[2]);
            }}
            allowFileAccess={true}
            geolocationEnabled={true}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            injectedJavaScript={INJECTEDJAVASCRIPT}
            onLoadStart={() => {
              setWebL(true);
            }}
            onLoadEnd={() => {
              setFavIcon("https://api.statvoo.com/favicon/?url=" + cUrl);
              setWebL(false);
              setHttpIcon();
              setWebTS(cUrl.split("/")[2] > 26 ? cUrl.split("/")[2].substring(0, 24) + "..." : cUrl.split("/")[2]);
              saveHistory();
            }}
            userAgent="Mozilla/5.0 (Linux; Android 5.1.1; Nexus 5 Build/LMY48B; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/43.0.2357.65 Mobile Safari/537.36"
            onMessage={onMessage}
            javaScriptEnabled={appInfo.disableJS == true ? false : true}
            domStorageEnabled={appInfo.disableCookies == true ? false : true}
          />
          : <></>
        }
      </View>

      {/* Search 3 */}
      {
        fullscreen || f2 ?
        <></>
        :
        <Animated.View
          style={{
            opacity: BottomNavOpacity
          }}
        >
        <View style={styles.search_3}>
        <TouchableOpacity onPress={se1} style={styles.sea_3_item}>
          <View>
            <IonicIcon style={styles.sea3__3_icon} name="chevron-back-outline"/>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={se2} style={styles.sea_3_item}>
          <View>
            <IonicIcon style={styles.sea3__3_icon} name="chevron-forward-outline"/>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={se3} style={styles.sea_3_item}>
          <View>
            <IonicIcon style={styles.sea3__3_icon} name="home-outline"/>
          </View>
        </TouchableOpacity>
        {
          bookmarksKeyValue.includes(currentUrl) ?
          <TouchableOpacity onPress={se4Remove} style={styles.sea_3_item}>
            <View>
              <IonicIcon style={styles.sea3__3_icon_r} name="heart"/>
            </View>
          </TouchableOpacity>
          :
          <TouchableOpacity onPress={se4} style={styles.sea_3_item}>
            <View>
              <IonicIcon style={styles.sea3__3_icon_r} name="heart-outline"/>
            </View>
          </TouchableOpacity>
        }
        {/* <TouchableOpacity onPress={se4} style={styles.sea_3_item}>
          <View>
            {
              bookmarksKeyValue.includes(currentUrl) ?
              <IonicIcon style={styles.sea3__3_icon_r} name="heart"/>
              :
              <IonicIcon style={styles.sea3__3_icon} name="heart-outline"/>
            }
          </View>
        </TouchableOpacity> */}
        <TouchableOpacity onPress={se5} style={styles.sea_3_item}>
          {/* Future Tab Feature */}
          {/* <View style={{justifyContent: "center", alignItems: "center"}}>
            <View style={{
              height: 17,
              width: 17,
              borderWidth: 1.6,
              borderRadius: 4,
              borderColor: "#767778FE",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <Text style={{
                color: "#767778FE",
                fontSize: 10,
                textAlign: "center",
                fontWeight: "bold",
              }}>
                1
              </Text>
            </View>
          </View> */}
          <View>
            <IonicIcon style={styles.sea3__3_icon} name="grid-outline"/>
          </View>
        </TouchableOpacity>
        </View>
        </Animated.View>
      }
        
    </View>
        
    </SafeAreaView>
  );

}

export default Search;