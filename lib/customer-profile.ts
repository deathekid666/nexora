export const CUSTOMER_PROFILE_KEY="lhawta-customer-profile-v1";
export const CUSTOMER_PROFILE_EVENT="lhawta-customer-profile-updated";

export type CustomerProfile={
  name:string;
  phone:string;
  city:string;
  address:string;
};

export const emptyCustomerProfile:CustomerProfile={
  name:"",
  phone:"",
  city:"",
  address:"",
};

export function readCustomerProfile():CustomerProfile{
  if(typeof window==="undefined") return emptyCustomerProfile;
  try{
    const raw=window.localStorage.getItem(CUSTOMER_PROFILE_KEY);
    const parsed=raw?JSON.parse(raw):{};
    return {
      name:typeof parsed?.name==="string"?parsed.name:"",
      phone:typeof parsed?.phone==="string"?parsed.phone:"",
      city:typeof parsed?.city==="string"?parsed.city:"",
      address:typeof parsed?.address==="string"?parsed.address:"",
    };
  }catch{
    return emptyCustomerProfile;
  }
}

export function writeCustomerProfile(profile:CustomerProfile){
  if(typeof window==="undefined") return;
  const clean={
    name:profile.name.trim().slice(0,120),
    phone:profile.phone.trim().slice(0,40),
    city:profile.city.trim().slice(0,100),
    address:profile.address.trim().slice(0,500),
  };
  window.localStorage.setItem(CUSTOMER_PROFILE_KEY,JSON.stringify(clean));
  window.dispatchEvent(new CustomEvent(CUSTOMER_PROFILE_EVENT,{detail:clean}));
}

export function clearCustomerProfile(){
  if(typeof window==="undefined") return;
  window.localStorage.removeItem(CUSTOMER_PROFILE_KEY);
  window.dispatchEvent(new CustomEvent(CUSTOMER_PROFILE_EVENT,{detail:emptyCustomerProfile}));
}
