import { setShopProvider, shop_provider, updateShopOpenStatus } from "~/provider/provider";
import { useAuth } from "~/utils/auth";
import useAxiosInstance from "~/utils/axiosInstance";

export interface UpdateShopRequest {
  name: string;
  address: string;
  phone: string;
  description: string;
}

export async function fetchingShopData(user_id : number, request: Request) {
    try {
        const { getCookie } = useAuth;
        const data = await getCookie({request})
        const token = data?.token;
        const res = await fetch(`${process.env.API_BASE_URL}/users/${user_id}/shop`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
        const shop = await res.json();
        await setShopProvider(user_id, shop.data);

      } catch (error) {
        console.error(error);
    }
    return {
        "code": 200,
        "shop" : shop_provider[user_id]
    }
}

export async function changeShopOpenStatus(shop_id : number, request: Request){
  let user_id = 0;
  try {
    const axios = useAxiosInstance(request);
    const response = await axios.put(`shops/${shop_id}/is-open`);
    const { getCookie } = useAuth;
    const data = await getCookie({request})
    user_id = data.user_id;
    updateShopOpenStatus(user_id);
    return {
      "code": 200,
      "data": "Shop status changed successfully",
      "shop": shop_provider[user_id]
    }

  } catch (error) {
    console.error(error);
  }
  
}

export async function updateShop(shop_id : number, updateRequest : UpdateShopRequest, request : Request){
  try {
    const axios = useAxiosInstance(request);
    var response = await axios.put(`shops/${shop_id}`, updateRequest)
  } catch (e) {
    console.error(e);
  }
  return {
    "code" : 200,
    "data" : response!.data,
  }
}

export async function changeshopAvatar(shop_id: number, formData: FormData, request: Request) {
  try {
    const { getCookie } = useAuth;
    const data = await getCookie({request})
    const token = data.token;
    const response = await fetch(`${process.env.API_BASE_URL}/shops/${shop_id}/avatar`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      body: formData, 
    });

    
  } catch (e) {
    console.error("Error:", e);
  }
}

export async function fetchShopStat(shop_id: number, request: Request) {
  try {
    console.log("fetching shop stat")
    const { getCookie } = useAuth;
    const data = await getCookie({request})
    const token = data.token;


    const res = await fetch(`${process.env.API_BASE_URL}/queues/getShopStat/?shop_id=${shop_id}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    const response = await res.json();


    return response.data;
  } catch (e) {
    console.error(e);
  }
}

export async function changeShopPassword(request : Request, formData: FormData){
  try {
    const { getCookie } = useAuth;
    const data = await getCookie({request})
    const token = data.token;
    const user_id = data.user_id;

    const res = await fetch(`http://laravel.test/api/users/${user_id}/password`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "new_password": formData.get("new_password"),
      })
    });
      
    const response = await res.json();

    
    if(res.status === 200) {
      return {
        "code": 200,
      }
    }

    if (response.code !== 200) {
      return {
        "code": 500,
        "data": response.message
      }
    
  }

    // return response;
  } catch (e) {
    console.error(e);
  }
}

export async function fetchingShopItems(shop_id: number, request: Request) {
  try {
    const { getCookie } = useAuth;
    const data = await getCookie({request})
    const token = data.token;

    const res = await fetch(`${process.env.API_BASE_URL}/shops/${shop_id}/items`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    const response = await res.json();
    console.log("Response:", response);

    return response.data;
  } catch (e) {
    console.error(e);
  }
}