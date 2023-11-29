import { environment } from "src/environments/environment"

const apiEndpointURL = environment.siteUrl + environment.baseSiteId

export const POST_SEND_NOTE_ENDPOINT = {
  url: environment.siteUrl + 'fletcherwebservices/v2/fi-spa/fbB2BUser/send-note'
}

export const POST_PRODUCT_INQUIRY = {
  url: environment.siteUrl + 'fletcherwebservices/v2/fi-spa/fbB2BUser/help-with-product'
}

export const POST_REVOKE = {
  url: environment.siteUrl + 'authorizationserver/oauth/revoke'
}

export const POST_ADD_NEW_TEAM_MEMBER_ENDPOINT = {
  url: environment.siteUrl + "fletcherwebservices/v2/fi-spa/fbB2BUser/team-member"
}

export const POST_USER_PROFILE_UPDATE = {
  url: environment.siteUrl + "fletcherwebservices/v2/fi-spa/fbB2BUser/user-details"
}

export const GET_AVAILABLE_USERS = { 
  url: environment.siteUrl + 'fletcherwebservices/v2/fi-spa/orgUnits/availableUsers'
}

export const FB_B2B_USER = { 
  url: environment.siteUrl + 'fletcherwebservices/v2/tradeLink-spa/fbB2BUser/createUser'
}

export const LINK_TRADE_ACCOUNTS = { 
  url: environment.siteUrl + 'fletcherwebservices/v2/tradeLink-spa/fbB2BUser/'
}

export const SWITCH_TRADE_ACCOUNTS = { 
  url: environment.siteUrl + 'fletcherwebservices/v2/tradeLink-spa/fbB2BUser/'
}

export const LIST_TRADE_ACCOUNTS = { 
  url: environment.siteUrl + 'fletcherwebservices/v2/tradeLink-spa/fbB2BUser/'
}
  
export const AUTH0_GET_TOKEN = { 
  url: environment.auth0Domain + '/oauth/token' 
}

export const FIND_STORE = { 
 // url: 'https://spartacus-demo.eastus.cloudapp.azure.com:8443/occ/v2/apparel-uk-spa/stores?fields=stores(DEFAULT)' 
 url: environment.siteUrl + 'fletcherwebservices/v2/tradeLink-spa/stores?currentPage=0&fields=FULL'
}

export const DIRECTION_URL = { 
  url: 'https://www.google.com/maps/dir/Current+Location/' 
}

export const GOOGLEAPI_LINK = {
  url: 'https://maps.googleapis.com/maps/api/geocode/json?'
 // url: 'https://maps.googleapis.com/maps/api/geocode/json?address=SILVERLAKE,+AU&key=AIzaSyAvFaeE_BCcuxnbxuSHDft-0oH495tiT3o'
}

export const GET_INVITEE_LIST_ENDPOINT = {
 // url: "https://api.crre-fletcherb2-d1-public.model-t.cc.commerce.ondemand.com/fletcherwebservices/v2/tradeLink-spa/invite/listofinvites?fields=DEFAULT&selectedTradeAccount=AC2&userId=vasanthraj123%40gmail.com"
 url: environment.siteUrl + 'fletcherwebservices/v2/tradeLink-spa/invite/'
}

export const POST_CREATE_INVITEE_ENDPOINT = {
  url: environment.siteUrl + 'fletcherwebservices/v2/tradeLink-spa/invite/'
 }


 export const POST_UPDATE_INVITEE_ENDPOINT = {
  url: environment.siteUrl + 'fletcherwebservices/v2/tradeLink-spa/invite/'
 }

 export const DELETE_INVITEE_ENDPOINT = {
  url: environment.siteUrl + 'fletcherwebservices/v2/tradeLink-spa/invite/'
  //url: "https://api.crre-fletcherb2-d1-public.model-t.cc.commerce.ondemand.com/fletcherwebservices/v2/tradeLink-spa/invite/deleteInvite?fields=DEFAULT&userId=vasanthraj123@gmail.com"
}

export const DELETE_CART_DATA = {
  url: environment.siteUrl + 'fletcherwebservices/v2/tradeLink-spa/addEditQuotes/'
  //url: "https://api.crre-fletcherb2-d1-public.model-t.cc.commerce.ondemand.com/fletcherwebservices/v2/tradeLink-spa/invite/deleteInvite?fields=DEFAULT&userId=vasanthraj123@gmail.com"
}

export const GET_LIST_My_LIST_ENDPOINT = {
  // url: "https://api.crre-fletcherb2-d1-public.model-t.cc.commerce.ondemand.com/fletcherwebservices/v2/tradeLink-spa/invite/listofinvites?fields=DEFAULT&selectedTradeAccount=AC2&userId=vasanthraj123%40gmail.com"
  url: apiEndpointURL + "mylist/"
 }

 export const GET_My_Quotes_ENDPOINT = {
  url: apiEndpointURL + "addEditQuotes/"
 }

//  export const GET_EXPIRED_QUOTE_CODE = {
//   url: apiEndpointURL + 'fbQuotes/quote/'
//  }

 export const GET_QUOTE_DETAIL_ENDPONT = {
  url: apiEndpointURL + 'fbQuotes/quote/'
}

export const GET_Active_QUOTE_DETAIL_ENDPONT = {
  url: apiEndpointURL + 'addEditQuotes/'
}

 export const POST_CREATE_My_List_ENDPOINT = {
   url: apiEndpointURL + "mylist/"
  }
 
  export const POST_Add_To_My_List_ENDPOINT = {
    url:apiEndpointURL + "mylist/addtolist?"
   }

   export const POST_Save_To_My_List_ENDPOINT = {
    url:apiEndpointURL + "mylist/saveList"
   }

   export const POST_Delete_My_List_ENDPOINT = {
    url:apiEndpointURL + "mylist/"
   }

   export const POST_Archive_My_List_ENDPOINT = {
    url:apiEndpointURL + "mylist/"
   }

   export const POST_Pinned_My_List_ENDPOINT = {
    url:apiEndpointURL + "mylist/"
   }

   export const POST_Edit_List_Name_ENDPOINT = {
    url:apiEndpointURL + "mylist/"
   }

   export const POST_Delete_Product_From_List_Name_ENDPOINT = {
    url:apiEndpointURL + "mylist/addtolist"
   }

   export const userId = localStorage.getItem('selectedIUID');

   export const orderCheckoutPage = {
    url:apiEndpointURL,
    coreLogicToken: environment.coreLogicTokenUrl,
    coreLogicPropSearch: environment.coreLogicUrl+ "property/au/v2/suggest.json?suggestionTypes=address&q="
   }

   export const invoice_adjustment = {
    url:apiEndpointURL,
   }

   export const quote_adjustment = {
    url:apiEndpointURL + 'addEditQuotes',
   }

   export const Get_Order_List_ENDPOINT = {
    url:apiEndpointURL + `history/account/orders?`
   }
   export const Get_Order_Detail_ENDPOINT = {
    url:apiEndpointURL + `history/order/`
   }

   export const GET_QUOTES_ENDPOINT = {
    url: apiEndpointURL + 'fbQuotes/quotes?fields=DEFAULT'
  }

  export const GET_SEARCH_QUOTE = {
    url: apiEndpointURL + 'addEditQuotes/fbQuotes?'
  }
  export const GET_MY_QUOTE = {
    url: apiEndpointURL + 'addEditQuotes/fbQuotes'
  }

  export const GET_IFRAMETOKEN_API = {
    url: apiEndpointURL + 'invoice/getInvoiceTransactionOTP?field=DEFAULT'
  }

  export const GET_CLOUD_INTEGRATION_LOAD_API= {
    url: apiEndpointURL + 'connectionInfo'
  }

  export const CLOUD_INTEGRATION_XERO = {
    url: apiEndpointURL + 'cloudConnect?connectionStatus='
  }

  export const GET_CLOUD_CONNECTION = {
    url: apiEndpointURL + 'cloud/getCloudConnection?'
  }
  export const GET_STATEMENTS_PREFERENCE_API = {
    url: apiEndpointURL + 'getPreferences'
  }

  export const GET_DOWNLOAD_FORMATS_API = {
    url: apiEndpointURL + 'getDownloadFormats'
  }

  export const GET_MY_LIST_API = {
    url: apiEndpointURL + 'mylist/getMyList'
  }

  export const POST_PREFERENCES_SETTINGS_API = {
    url: apiEndpointURL
  }

  export const GET_ORG_USERS_RESPONSE = {
    url: apiEndpointURL + "orgUsers/current?lang=en_AU&curr=AUD"
  }

 
  export const GET_POD_API = {
    url: apiEndpointURL + 'users/'
  }

  export const GET_ACCOUNT_BALANCE = {
    url: apiEndpointURL + 'getAccountBalance'
  }
  export const GET_PAYMENT_HISTORY = {
    url: apiEndpointURL + 'order-payment/paymentHistory'
  }
  
  export const CHANGE_BRANCH = {
    url: apiEndpointURL + 'fbB2BUser/update-branch?branchName='
  }
  
  export const ADD_ALL_TO_CART_API = {
    url: apiEndpointURL + 'users/'
  }

  export const ADD_TO_QUOTE = {
    url: apiEndpointURL + 'addEditQuotes/'
  }

  export const CLEAR_ALL_CART_API = {
    url: apiEndpointURL + 'users/'
  }

  export const CORE_LOGIC_SUGGESTION_API = {
    url: apiEndpointURL + 'corelogic/address/suggestions?fields=DEFAULT&text='
  }

  export const CORE_LOGIC_PROPERTY_DETAIL_API = {
    url: apiEndpointURL + 'corelogic/address/details?fields=FULL&propertyId='
  }

   //Start customer Quotes 
   export const ADD_PRODUCT_TO_QUOTE = {
    url: '/sob/entries?fields=DEFAULT',
  }

  export const COMPANY_PROFILE = {
    url: apiEndpointURL  +'/quotes/company-profile'
  }

  export const CREATE_QUOTES = {
    url: apiEndpointURL + 'quotes',
    updateUrl: ''//environment.apiDomain + environment.siteApiExtn + '/quotes?fields=BASIC'
  }


  export const GET_QUOTES = {
    url: apiEndpointURL + 'quotes',//environment.apiDomain + environment.siteApiExtn + '/quotes?fields=FULL',
    updateUrl: ''//environment.apiDomain + environment.siteApiExtn + '/quotes?fields=BASIC'
  }

  export const JOB_DETAILS = {
    url: apiEndpointURL + 'quotes/'
  }

  export const COREOGIC_ADDRESS_API = {
    url:'https://pg.emap.co.nz/map/til_rest/299098_NmhMMm5C52xjvMb/address_locator/rest/services/GEOCODE/AddressLocator/GeocodeServer/suggest?f=pjson&maxSuggestions=10&countryCode=nz&text='
  }

  export const REPRICE_QUOTE = {
    url: '/reprice',
  }

  export const GET_SEARCH_PRODUCT_RESULTS = {
    url: apiEndpointURL + 'products/search'
  }
  
  export const GET_SEARCH_RESULT_SUGGESTIONS = {
    url: apiEndpointURL + 'products/suggestions?term='
  }

  export const GET_USER = {
    url: ''//environment.apiDomain + environment.siteApiExtn + '/users'
  }
  
  export const GET_USER_CART = {
    url: ''//environment.apiDomain + environment.siteApiExtn + '/users/current/carts'
  }
  
  export const GET_JOB_ACC_FOR_TRADE_ACC = {
    url: ''//environment.apiDomain + environment.siteApiExtn
  }

  export const SELECTED_BRANCH = {
    url: ''// environment.apiDomain + environment.siteApiExtn
  }
  export const UPLOADFILESTOQUOTE = {
    url: '/quotemedia'
  }
//End customer Quotes 

// Create New Format
export const GET_FILE_FORMATS_API = {
  url: apiEndpointURL + 'downloadformats/loadDefaults'
}
export const DELETE_FILE_FORMATS_API = {
  url: apiEndpointURL + 'downloadformats/delete'
}
export const GET_DOWNLOAD_FORMATS_FILE_API = {
  url: apiEndpointURL + 'downloadformats/getList'
}
export const CREATE_NEW_FORMAT_API = {
  url: apiEndpointURL + 'downloadformats/create'
}
export const GET_FORMAT_ATTRIBUTES_API = {
  url: apiEndpointURL + 'downloadformats/getDetails'
}
export const EDIT_FORMAT_ATTRIBUTES_API = {
  url: apiEndpointURL + 'downloadformats/edit'
}
export const POST_DOWNLOAD_INVOICE_FORMAT = {
  url: apiEndpointURL + 'invoice/downloadFormatCsv'
}
// End of Create New Format