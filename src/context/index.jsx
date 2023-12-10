import React, { useContext, useState, createContext } from 'react';

import { useAddress, useContract, useMetamask, useContractWrite, useContractRead } from '@thirdweb-dev/react-native';
import { ethers } from 'ethers';
import { calTotalTickets } from '../utils';

//IPFS URL
//import { useStorageUpload } from '@thirdweb-dev/react';

//AXIOS
import axios from 'axios';
import { err } from 'react-native-svg/lib/typescript/xml';


const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const { contract, isLoading } = useContract('0x57a16bA9144b76FD2a87cad6C8B17BC8393e6F0F');
  const { mutateAsync: createConcert, isLoading1 } = useContractWrite(contract, "createConcert")
  const { mutateAsync: createOrganizer, isLoading2 } = useContractWrite(contract, "registerAsOrganizer")

  const address = useAddress();
  //const connect = useMetamask();

  //IPFS URL === START
  const [file, setFile] = useState([]);
  const [uploadUrls, setUploadUrls] = useState('');

  const publishCampaign = async (form) => {
    try {
      console.log('form:', form);
      const numConcert = await contract.call('numConcerts');

      // Format zoneInfo as a 2D array of uint256
      const zoneInfo = form.zoneInfo.map(row => [
        ethers.BigNumber.from(row.price),
        ethers.BigNumber.from(row.seatAmount)
      ]);

      // console.log('form.numConcert:', numConcert.toNumber());
      // console.log('form.name:', form.name);
      // console.log('form.date:', convertDatetimeToUint256(form.date));
      // console.log('form.venue:', form.venue);
      // console.log('form.numZone:', ethers.BigNumber.from(form.numZone));
      // console.log('form.zoneInfo:', zoneInfo);
      // console.log('form.image:', form.image);
      // console.log('form.imageURL', await uploadToIpfs(form.image));

      //Set ImageUrls by the uploaded image
      //const imageUrls = await uploadToIpfs(form.image);

      console.log('imageUrls:', imageUrls);

      // const data = await createConcert({
      //   args: [
      //     numConcert.add(ethers.BigNumber.from(1)),
      //     form.name,
      //     convertDatetimeToUint256(form.date),
      //     form.venue,
      //     ethers.BigNumber.from(form.zoneInfo.length),
      //     zoneInfo,
      //     imageUrls
      //   ],
      // });

      console.log("contract call success");

      //create form for axios
      const concert = {
        organizerid: await getConcertOwnerId(address),
        name: form.name,
        owner: address,
        venue: form.venue,
        description: form.description,
        category: 'none',
        createdDate: new Date().toISOString().slice(0, -1),
        conductedDate: form.date,
        numZone: form.zoneInfo.length,
        zoneinfo: JSON.stringify(form.zoneInfo),
        totalSeat: calTotalTickets(form.zoneInfo),
        imgurl: imageUrls
      }

      await axios.post("http://192.168.100.60:8800/concert", concert);

      console.log("axios call success");

    } catch (error) {
      console.log("contract call failure", error)
    }
  }

  const updateCampaign = async (form) => {
    try {
      console.log('form:', form);
      // Format zoneInfo as a 2D array of uint256
      const zoneInfo = form.zoneInfo.map(row => [
        ethers.BigNumber.from(row.price),
        ethers.BigNumber.from(row.seatAmount)
      ]);

      // console.log('form.concertId:', numConcert.toNumber());
      // console.log('form.name:', form.name);
      // console.log('form.date:', convertDatetimeToUint256(form.date));
      // console.log('form.venue:', form.venue);
      // console.log('form.numZone:', ethers.BigNumber.from(form.numZone));
      // console.log('form.zoneInfo:', zoneInfo);
      // console.log('form.image:', form.image);
      // console.log('form.imageURL', await uploadToIpfs(form.image));

      //const imageUrls = await uploadToIpfs(form.image);

      // const data = await createConcert({
      //   args: [
      //     ethers.BigNumber.from(form.concertId),
      //     form.name,
      //     convertDatetimeToUint256(form.date),
      //     form.venue,
      //     ethers.BigNumber.from(form.numZone),
      //     zoneInfo,
      //     imageUrls
      //   ],
      // });

      // console.log("contract call success", data)

      //update form for axios
      const concert = {
        organizerid: await getConcertOwnerId(address),
        name: form.name,
        owner: address,
        venue: form.venue,
        description: form.description,
        category: 'none',
        createdDate: new Date().toISOString().slice(0, -1),
        conductedDate: form.date,
        numZone: form.zoneInfo.length,
        zoneinfo: JSON.stringify(form.zoneInfo),
        totalSeat: calTotalTickets(form.zoneInfo),
        imgurl: imageUrls
      }
      console.log("update concert:", form.concertId)
      await axios.put(`http://192.168.100.60:8800/concert/${form.concertId}`, concert);

    } catch (error) {
      console.log("contract call failure", error)
    }
  }


  const getCampaigns = async () => {
    const campaigns = await contract.call('getConcerts');

    const parsedCampaigns = await Promise.all(
      campaigns.map(async (campaign, i) => {
        const zoneInfo = campaign.zoneInfo.map(row => ({
          price: row[0].toNumber(),
          seatAmount: row[1].toNumber()
        }));

        try {
          const response = await Promise.race([
            axios.get(`http://192.168.100.60:8800/concert/${i + 1}`),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
          ]);

          const { description, category } = response.data;
          // Convert category from string to array
          const categoryArray = category.split(",");
          return {
            cId: campaign.concertId.toNumber(),
            owner: campaign.owner,
            name: campaign.name,
            venue: campaign.venue.toString(),
            description: description,
            numZones: campaign.numZones.toNumber(),
            zoneInfo: zoneInfo,
            date: campaign.date.toNumber(),
            image: campaign.imageUrl,
            category: categoryArray,
            pId: i
          };

        } catch (error) {
          console.log('Error fetching concert data', error);
          console.log('Proceed with serverless mode...');
          return {
            cId: campaign.concertId.toNumber(),
            owner: campaign.owner,
            name: campaign.name,
            venue: campaign.venue.toString(),
            numZones: campaign.numZones.toNumber(),
            zoneInfo: zoneInfo,
            date: campaign.date.toNumber(),
            image: campaign.imageUrl,
            pId: i
          };
        }
      })
    );

    const filteredCampaigns = parsedCampaigns.filter(campaign => campaign !== null);

    //console.log("filteredCampaigns", filteredCampaigns);

    return filteredCampaigns;
  }

  const getConcertById = async (concertId) => {
    const concert = await contract.call('getConcertDetails', [concertId]);
    const zoneInfo = concert.zoneInfo.map(row => ({
      price: row[0].toNumber(),
      seatAmount: row[1].toNumber()
    }));

    const parsedCampaigns = {
      cId: concert.concertId,
      owner: concert.owner,
      name: concert.name,
      venue: concert.venue, // Convert to string
      numZones: concert.numZones.toNumber(),
      zoneInfo: zoneInfo,
      date: concert.date.toNumber(),
      image: concert.imageUrl,
    };

    //console.log("getConcertById", parsedCampaigns);

    return parsedCampaigns;
  }

  const getUserCampaigns = async () => {
    const allCampaigns = await getCampaigns();

    const filteredCampaigns = allCampaigns.filter((campaign) => campaign.owner === address);

    return filteredCampaigns;
  }

  const getConcertOwnerId = async (address) => {
    // Get concert's owner organizer id
    const organizer = await getOrganizer();

    //find organizer id by their address
    const organizerId = organizer.find((organizer) => organizer.account === address).oId;

    return organizerId;
  }

  const donate = async (pId, amount) => {
    const data = await contract.call('donateToCampaign', [pId], { value: ethers.utils.parseEther(amount) });

    return data;
  }

  const purchaseTickets = async (uniqueId, concertId, zoneId, numTickets, amount) => {
    try {
      console.log(uniqueId);
      console.log(concertId);
      console.log(zoneId);
      console.log(numTickets);
      console.log(amount);

      const data = await contract.call('purchaseTickets', [
        uniqueId,
        concertId,
        zoneId,
        numTickets
      ], {
        value: ethers.utils.parseEther((String(amount)))
      });

      // ticketid INT NOT NULL AUTO_INCREMENT,
      // concertid INT NOT NULL,
      // customerid INT NOT NULL,
      // receipt VARCHAR(255) NOT NULL,
      // zone VARCHAR(255) NOT NULL,
      // purchaseDate DATETIME NOT NULL,
      // used BOOLEAN NOT NULL,

      //create form for axios
      const ticket = {
        concertid: concertId,
        customerid: String(uniqueId),
        receipt: data.receipt.transactionHash,
        zone: zoneId,
        purchaseDate: new Date().toISOString().slice(0, -1),
        used: false
      }

      await axios.post("http://192.168.100.60:8800/ticket", ticket);

      console.log("Receipt", JSON.stringify(data.receipt));
      return data;
    } catch (error) {
      console.log("Error purchasing tickets:", error);
      throw error;
    }
  }

  const getUserTickets = async (uniqueId) => {
    try {
      const tickets = await contract.call('getUserOwnedTickets', [uniqueId._j]);
      //const tickets = await contract.call('getUserOwnedTickets', ["9bdd6a453246ebd2"]);
      //console.log("tickets", tickets);
      const existingTicket = await axios.get(`http://192.168.100.60:8800/ticket/${uniqueId._j}`);
      //console.log("existingTicket", existingTicket.data);

      const parsedTickets = [];

      for (let i = 0; i < tickets.length; i++) {
        parsedTickets.push({
          ticketId: i + 1,
          owner: tickets[i][0],
          time: tickets[i][1].toNumber(),
          concertId: tickets[i][2].toString(),
          zoneId: tickets[i][3].toString(),
          used: tickets[i][4],
          receipt: existingTicket.data[i] ? existingTicket.data[i].receipt : null,
        })
      }
      //console.log("User Ticket", JSON.stringify(parsedTickets, null, 2));

      return parsedTickets;
    } catch (error) {
      console.log("Error getting user tickets:", error);
      throw error;
    }
  }

  const getDonations = async (pId) => {
    const donations = await contract.call('getDonators', [pId]);
    const numberOfDonations = donations[0].length;

    const parsedDonations = [];

    for (let i = 0; i < numberOfDonations; i++) {
      parsedDonations.push({
        donator: donations[0][i],
        donation: ethers.utils.formatEther(donations[1][i].toString())
      })
    }

    return parsedDonations;
  }

  const applyOrganizer = async (form) => {
    try {
      const numOrg = await contract.call('numOrganizers');

      // console.log('form.numOrg:', numOrg.toNumber());
      // console.log('form.name:', form.name);
      // console.log('form.document:', form.document);
      // console.log('form.image:', await uploadToIpfs(form.document));

      //const imageUrls = await uploadToIpfs(form.document);

      // const data = await createOrganizer({
      //   args: [
      //     form.name,
      //     imageUrls
      //   ],
      // });

      // console.log("contract call success", data)

      //create form for axios
      const organizer = {
        name: form.name,
        email: form.email,
        account: address,
        documenturl: imageUrls,
        isverified: false,
        isarchived: false
      }

      await axios.post("http://192.168.100.60:8800/organizer", organizer);


    } catch (error) {
      console.log("contract call failure", error)
    }
  }

  const getOrganizer = async () => {
    //const { data, isLoading } = useContractRead(contract, "viewAllOrganizers", [onlyVerified, includeArchived])
    const data = await contract.call('getOrganizers');
    const parsedOrganizer = data.map((organizer, i) => ({
      oId: organizer.organizerId.toNumber(),
      account: organizer.account,
      name: organizer.name,
      documentUrl: organizer.documentUrl,
      isVerified: organizer.isVerified,
      isArchived: organizer.isArchived,
      pId: i
    }));

    return parsedOrganizer;
  }

  const updateOrganizer = async (form) => {
    console.log("updateOrganizer", form)

    //const imageUrls = await uploadToIpfs(form.documentUrl);

    try {
      const data = await contract.call('updateOrganizer', [
        ethers.BigNumber.from(form.oId),
        form.name,
        address,
        imageUrls,
        form.isVerified,
        form.isArchived
      ]);

      console.log("contract call success", data)

      //update form for axios
      const organizer = {
        oId: form.oId,
        name: form.name,
        email: form.email,
        account: address,
        documenturl: imageUrls,
        isverified: form.isVerified,
        isarchived: form.isArchived
      }

      await axios.put("http://192.168.100.60:8800/organizer", organizer);

    } catch (error) {
      console.log("contract call failure", error)
    }
  }

  const archiveOrganizer = async (organizerId) => {
    try {
      // const data = await contract.call('archiveOrganizer', [
      //   organizerId
      // ]);

      // console.log("contract call success", data)

      //update form for axios
      const organizer = {
        isArchived: true
      }

      console.log("archiveOrganizer", organizerId)
      await axios.put(`http://192.168.100.60:8800/organizer/${organizerId}`, organizer);

    } catch (error) {
      console.log("contract call failure", error)
    }
  }

  const setOrganizerStatus = async (organizerId, isVerified) => {
    try {
      // const data = await contract.call('setOrganizerVerificationStatus', [
      //   organizerId, isVerified
      // ]);

      // console.log("contract call success", data)

      //update form for axios
      const organizer = {
        IsVerified: isVerified
      }

      console.log("setOrganizerStatus", organizerId)
      await axios.put(`http://192.168.100.60:8800/organizer/${organizerId}`, organizer);

    } catch (error) {
      console.log("contract call failure", error)
    }
  }

  const checkServer = async () => {
    try {
      const response = await axios.get("http://192.168.100.60:8800/", { timeout: 5000 });
      console.log("Server Online");
      return true;
    } catch (error) {
      console.log('Server Offline', error);
    }
  }

  const getCategory = async () => {
    try {
      const response = await axios.get("http://192.168.100.60:8800/category");
      //console.log("getCategory success", response.data);
      const categories = response.data.map(category => category.categoryname);
      return categories;
    } catch (error) {
      console.log("getCategory failure", error);
      return [];
    }
  };


  return (
    <StateContext.Provider
      value={{
        address,
        contract,
        //connect,
        createCampaign: publishCampaign,
        updateCampaign,
        getCampaigns,
        getUserCampaigns,
        donate,
        getDonations,
        applyOrganizer,
        getOrganizer,
        updateOrganizer,
        archiveOrganizer,
        setOrganizerStatus,
        purchaseTickets,
        getUserTickets,
        getConcertById,
        checkServer,
        getCategory
      }}
    >
      {children}
    </StateContext.Provider>
  )
}

export const useStateContext = () => useContext(StateContext);