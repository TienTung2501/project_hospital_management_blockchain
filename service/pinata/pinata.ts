

const AUTHORIZATION = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJlYzEyMGUwYS1iMmZhLTQ1MTUtOWNlMS02OTA5YmJjOTE5NTkiLCJlbWFpbCI6InRpZW50dW5nMDMubnR0dm5AZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9LHsiaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6ImRjN2M4MGVjNjE5N2VlMTExNDM4Iiwic2NvcGVkS2V5U2VjcmV0IjoiNmEzNjhiNzlkNGQ1NGVjOTFiYzUwYjRjY2Y5MWMzNjEwMjA5M2I2M2Y0ZWEwYjg0YWQ1ZjYyNmVhOTQ3NTA5NSIsImlhdCI6MTcwNzA1ODMzM30.99D9gyTrJRpnbdX_b5vf9u3nHDlXRfyabzKeHKG53bw`;
export async function postCloudPinata(formData: FormData) {
    try {
        const response = await fetch(
            "https://api.pinata.cloud/pinning/pinFileToIPFS",
            {
              method: "POST",
              headers: {
                Authorization: AUTHORIZATION,
              },
              body: formData,
            }
          );
          return  await response.json();
    } catch (error) {
        console.log(error);
        throw Error("Saving image to cloud failed")
    }
    
  }