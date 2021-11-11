import Homepage from './views/Homepage';
import Redirect from './views/Redirect';
import Init from './views/Init';
import './App.css';
import i18n from 'i18next';
import { initReactI18next } from "react-i18next";
import translationDE from './locales/de.json';
import translationEN from './locales/en.json';
import translationES from './locales/es.json';
import translationNL from './locales/nl.json';
import LanguageDetector from './utils/lang.js';
import { encodeState } from './utils/state.js';

const resources = {
  de: {
    translation: translationDE
  },
  en: {
    translation: translationEN
  },
  es: {
    translation: translationES
  },
  nl: {
    translation: translationNL
  }
};

function App() {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources
    })
  ;
  
  if (_isInitPageRequested()) {
    return (
      <Init />
    );
  }
  
  const oauthResponseParams = _oauthResponseParams();
  if (oauthResponseParams) {
    return (
      <div className="App">
        <Redirect oauthResponseParams={ oauthResponseParams } />
      </div>
    );
  } else {
    return (
      <div className="App">
        <Homepage oauthRequestParams={ _oauthRequestParams() } />
      </div>
    );
  }
}

function _oauthRequestParams() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const accessType = urlParams.get("access_type");
  
  if (accessType) {
    urlParams.set('state', encodeState({
      systemRedirectUri: urlParams.get("redirect_uri"),
      shopRedirectUri: urlParams.get("state")
    }));
    urlParams.set('redirect_uri', _baseUrl());
    return urlParams;
  }
}

function _oauthResponseParams() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const code = urlParams.get("code");
  if (code) {
    return urlParams;
  }
}

function _isRequestComingFromAuthorizationServer() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const authorizationCode = urlParams.get("code");
  
  return authorizationCode != null;
}

function _baseUrl() {
  return window.location.href.replace(/\/\?.*/g, '');
}

function _isInitPageRequested() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get("init");
}

export default App;