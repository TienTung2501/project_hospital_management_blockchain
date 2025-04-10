const convertIpfsAddressToUrl= function (ipfsAddress: string) {
    if (ipfsAddress.startsWith("ipfs://")) {
        const ipfsHash = ipfsAddress.slice("ipfs://".length);
        const pinataGatewayToken="ZF-2NSDMZeCixzMlrJNPo0-N-mcMc51IGpbOuHB5uduKMyNRGFVkOu9QbYj8HO13";
        const ipfsURL = `https://ivory-deaf-guineafowl-894.mypinata.cloud/ipfs/${ipfsHash}?pinataGatewayToken=${pinataGatewayToken}`;
        return ipfsURL;
    } else {
        return null;
    }
};
export default convertIpfsAddressToUrl;