import { BigNumber, utils, ethers } from 'ethers';

export const daysLeft = (deadline) => {
  const difference = new Date(deadline * 1000) - Date.now();
  const remainingDays = difference / (1000 * 3600 * 24);

  return remainingDays.toFixed(0);
};

export const checkIfImage = (url, callback) => {
  const img = new Image();
  img.src = url;

  if (img.complete) callback(true);

  img.onload = () => callback(true);
  img.onerror = () => callback(false);
};

export const calTotalAvailableTickets = (zoneInfo) => {
  let totalAvailableTickets = 0;

  try {
    for (let i = 0; i < zoneInfo.length; i++) {
      if (zoneInfo[i] && zoneInfo[i].seatAmount > 0) {
        totalAvailableTickets += zoneInfo[i].seatAmount;
      }
    }
  } catch (error) {
    console.log(error);
    return null;
  }

  return totalAvailableTickets;
};

export const calLowestTicketPrice = (zoneInfo) => {
  let lowestPrice = null;
  try {
    for (let i = 0; i < zoneInfo.length; i++) {
      const price = zoneInfo[i].price;
      if (lowestPrice === null || (price < lowestPrice
        && zoneInfo[i][1] > 0)) {
        lowestPrice = price;
      }
    }
  } catch (error) {
    console.log(error);
    return null;
  }

  return lowestPrice !== null ? lowestPrice + " ETH" : null;
};

export const calTotalTickets = (zoneInfo) => {
  let totalTickets = 0;
  try {
    for (let i = 0; i < zoneInfo.length; i++) {
      if (zoneInfo[i] && zoneInfo[i].seatAmount > 0) {
        totalTickets += Number(zoneInfo[i].seatAmount);
        console.log(zoneInfo[i].seatAmount);
      }
    }
  } catch (error) {
    console.log(error);
    return null;
  }

  return totalTickets;
}

export const calculateBarPercentage = (zoneInfo) => {
  //Sum all ticket in zoneInfo[i].seatAmount
  let totalSeat = calTotalTickets(zoneInfo);
  const percentage = Math.round((calTotalAvailableTickets * 100) / totalSeat);
  return percentage;
};


export const directoryToJSON = async (image) => {
  let images = [];

  try {
    const response = await fetch(image);
    const json = await response.json();
    images = json;
  } catch (error) {
    console.error(error);
  }

  return images
};

