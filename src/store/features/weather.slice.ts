import { WeatherData } from "@/types/weather.type";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

//

export const getWeather = createAsyncThunk(
  "weatherSlice/getWeather",
  async (values: { country: string }) => {
    const options = {
      url: `http://api.weatherapi.com/v1/forecast.json?key=31d0916effee4ec78a314510252403&q=${values.country}&days=3`,
      method: "GET",
    };
    const { data } = await axios.request(options);
    return data;
  }
);
const initialState: WeatherData = {
  current: null,
  forecast: null,
  location: null,
  isLoading: false,
  isError: false,
  error:""
};
const x = createSlice({
  name: "weatherSlice",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getWeather.fulfilled, (prevState, action) => {
      console.log("fulfilled");
      prevState.isError = false;
      prevState.isLoading = false;
      prevState.current = action.payload.current;
      prevState.forecast = action.payload.forecast;
      prevState.location = action.payload.location;
      
    });
    builder.addCase(getWeather.rejected, (prevState) => {
        prevState.isError = true;
        prevState.isLoading = false;

    });
    builder.addCase(getWeather.pending, (prevState) => {
        prevState.isError = false;
        prevState.isLoading = true;
    });
  },
});

export const wweatherSlicer = x.reducer;
