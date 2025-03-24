"use client";
import Image from "next/image";
import Link from "next/link";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "@/hooks/slice-hook";
import { getWeather } from "@/store/features/weather.slice";
import { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import { FiSearch } from "react-icons/fi";
import { BsDroplet, BsWind, BsCompass } from "react-icons/bs";
import { ForecastDay, CurrentWeather } from '@/types/weather.type'; // Adjust the path

export default function Home() {
  const dispatch = useAppDispatch();
  const [searchFocused, setSearchFocused] = useState(false);
  
  const validationSchema = Yup.object().shape({
    country: Yup.string().required("Please enter a city name"),
  });

  const formik = useFormik({
    initialValues: {
      country: "",
    },
    validationSchema,
    onSubmit(values) {
      dispatch(getWeather(values));
    },
  });

  const { current, forecast, isLoading, location } =
    useAppSelector((store) => store.wweatherSlicer);

  useEffect(() => {
    dispatch(getWeather({ country: "Cairo" }));
  }, [dispatch]);


  const weatherCards = [
    current,
    ...(forecast?.forecastday?.slice(1, 3) || [])
  ].filter(Boolean); 

 
  const getSafeDate = (dateString?: string, fallback?: string) => {
    try {
      return dateString ? new Date(dateString) : fallback ? new Date(fallback) : new Date();
    } catch {
      return new Date();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white font-sans">
      <nav className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-700/50 p-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              Weatherify
            </span>
          </div>
          <div className="hidden md:flex space-x-6">
            {["Home", "News", "Live Cameras", "Photos", "Contact"].map((item) => (
              <Link
                key={item}
                href=""
                className="hover:text-blue-400 transition-colors duration-200 font-medium text-slate-300 hover:text-white"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Search Form */}
        <div className="flex justify-center mb-10">
          <form
            className={`relative w-full max-w-xl transition-all duration-300 ${searchFocused ? "ring-2 ring-blue-500" : ""}`}
            onSubmit={formik.handleSubmit}
          >
            <div className="relative flex items-center">
              <FiSearch className="absolute left-4 text-slate-400 text-xl" />
              <input
                onInput={(e) => {
                  const target = e.target as HTMLInputElement;
                  dispatch(getWeather({ country: target.value }));
                }}
                name="country"
                value={formik.values.country}
                onChange={formik.handleChange}
                onBlur={(e) => {
                  formik.handleBlur(e);
                  setSearchFocused(false);
                }}
                onFocus={() => setSearchFocused(true)}
                type="search"
                placeholder="Search for a city..."
                className="pl-12 pr-24 py-4 w-full rounded-xl bg-slate-800/50 border border-slate-700 focus:outline-none focus:bg-slate-800 text-white placeholder-slate-400 transition-all"
              />
              <button
                disabled={!formik.isValid || !formik.dirty}
                type="submit"
                className={`absolute right-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  !formik.isValid || !formik.dirty
                    ? "bg-slate-700 text-slate-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg"
                }`}
              >
                Search
              </button>
            </div>
            {formik.errors.country && formik.touched.country && (
              <p className="mt-2 text-sm text-rose-400">{formik.errors.country}</p>
            )}
          </form>
        </div>

        {/* Weather Display */}
        {!isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {weatherCards.map((day, index) => {
              if (!day) return null;
              
              const date = getSafeDate(
                (day as ForecastDay)?.date,
                (day as CurrentWeather)?.last_updated || location?.localtime
              );

              const isCurrentWeather = index === 0;
              const weatherCondition = isCurrentWeather 
                ? (day as CurrentWeather).condition 
                : (day as ForecastDay).day.condition;

              const temperature = isCurrentWeather
                ? (day as CurrentWeather).temp_c
                : (day as ForecastDay).day.maxtemp_c;

              const minTemperature = isCurrentWeather
                ? undefined
                : (day as ForecastDay).day.mintemp_c;

              return (
                <div
                  key={index}
                  className={`relative p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden ${
                    isCurrentWeather
                      ? "bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700"
                      : index % 2 !== 0
                      ? "bg-gradient-to-br from-slate-800/70 to-slate-900/70 border border-slate-700/50"
                      : "bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/30"
                  }`}
                >
                  {isCurrentWeather && (
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500 rounded-full filter blur-3xl opacity-10"></div>
                  )}
                  
                  <header className="mb-4">
                    <div className="flex justify-between items-center text-slate-300">
                      <p className="text-lg font-medium">
                        {isCurrentWeather ? "Current Weather" : 
                          date.toLocaleDateString("en-US", { weekday: "long" })
                        }
                      </p>
                      <p className="text-sm bg-slate-700/50 px-3 py-1 rounded-full">
                        {date.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    {location && (
                      <h3 className="text-xl mt-2 font-semibold">
                        {location.name}, {location.country}
                      </h3>
                    )}
                  </header>

                  <section className="text-center py-4">
                    <div className="flex justify-center items-start">
                      <h2 className="text-6xl font-extrabold mb-2">
                        {temperature}
                        <sup className="text-3xl">°C</sup>
                      </h2>
                      {minTemperature !== undefined && (
                        <span className="text-lg ml-2 mt-2 text-slate-400">
                          / {minTemperature}°
                        </span>
                      )}
                    </div>
                    
                    <div className="flex justify-center my-4">
                      {weatherCondition?.icon && (
                        <Image
                          width={100}
                          height={100}
                          src={`https:${weatherCondition.icon}`}
                          alt={weatherCondition.text || "Weather icon"}
                          className="drop-shadow-lg"
                        />
                      )}
                    </div>
                    <p className="text-xl font-medium capitalize">
                      {weatherCondition?.text}
                    </p>
                  </section>

                  {isCurrentWeather && current && (
                    <div className="mt-6 pt-6 border-t border-slate-700/50">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="flex flex-col items-center">
                          <BsDroplet className="text-blue-400 text-xl mb-1" />
                          <span className="text-sm text-slate-400">Humidity</span>
                          <span className="font-medium">{current.humidity}%</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <BsWind className="text-blue-400 text-xl mb-1" />
                          <span className="text-sm text-slate-400">Wind</span>
                          <span className="font-medium">{current.wind_kph} km/h</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <BsCompass className="text-blue-400 text-xl mb-1" />
                          <span className="text-sm text-slate-400">Direction</span>
                          <span className="font-medium">{current.wind_dir}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex justify-center items-center h-64">
            <Loading />
          </div>
        )}

        {!isLoading && forecast?.forecastday?.length && (
          <div className="mt-12">
            <h3 className="text-xl font-semibold mb-6 text-slate-300">3-Day Forecast</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {forecast.forecastday.map((day, index) => (
                <div key={index} className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-4 hover:bg-slate-800/50 transition-colors">
                  <div className="flex justify-between items-center mb-3">
                    <p className="font-medium">
                      {new Date(day.date).toLocaleDateString("en-US", {
                        weekday: "long",
                      })}
                    </p>
                    <p className="text-sm text-slate-400">
                      {new Date(day.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {day.day.condition.icon && (
                        <Image
                          width={48}
                          height={48}
                          src={`https:${day.day.condition.icon}`}
                          alt={day.day.condition.text}
                        />
                      )}
                      <span className="ml-2 text-sm capitalize">
                        {day.day.condition.text}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-medium">{day.day.maxtemp_c}°</span>
                      <span className="text-slate-400 ml-2">{day.day.mintemp_c}°</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="mt-16 py-6 bg-slate-900/80 border-t border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-400">
          <div className="flex justify-center space-x-6 mb-4">
            {["Terms", "Privacy", "Contact"].map((item) => (
              <Link
                key={item}
                href=""
                className="hover:text-blue-400 transition-colors"
              >
                {item}
              </Link>
            ))}
          </div>
          <p className="text-sm">
            © {new Date().getFullYear()} Weatherify. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
