import axios from "axios";

export const get = async (url, headers) => {
  try {
    const res = await axios.get(url, { headers });
    if (res) {
      return res;
    }
  } catch (e) {
    throw e;
  }
};

export const post = async (url, body, headers) => {
  try {
    const res = await axios.post(url, body, { headers });
    if (res) {
    }
    return res;
  } catch (e) {
    throw e;
  }
};

export const patch = async (url, body, headers) => {
  try {
    const res = await axios.patch(url, body, { headers });
    if (res) {
    }
    return res;
  } catch (e) {
    throw e;
  }
};

export const del = async (url, headers) => {
  try {
    const res = await axios.delete(url, { headers });
    if (res) {
    }
    return res;
  } catch (e) {
    throw e;
  }
};
