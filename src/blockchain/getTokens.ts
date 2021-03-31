import { contractToken, hmy, options } from './sdk';


export const getTotalSupply = async () => {
  let totalSupply = (await contractToken.methods.totalSupply().call(options)).toString();
  console.log({totalSupply})
  return totalSupply
}

export const getTokens = (address): Promise<any[]> => {
  return new Promise(async (resolve, reject) => {
    try {
      const addrHex = hmy.crypto.getAddress(address).checksum;

      let count = await contractToken.methods.balanceOf(addrHex).call(options);

      count = Number(String(count));

      const tokens = await Promise.all(
        [...new Array(count)].map(async (r, idx) => {
          let json, token, url, playerId;

          try {
            token = await contractToken.methods
              .tokenOfOwnerByIndex(addrHex, idx)
              .call(options);

            url = await contractToken.methods.tokenURI(token).call(options);
            playerId = await contractToken.methods.playerIdByToken(token).call(options)

            const response = await fetch(url, { mode: 'cors' });

            json = await response.json();
          } catch (e) {
            console.error(e.message);
            console.log(idx, token, url);
          }

          return {...json, playerId};
        }),
      );

      resolve(tokens);
    } catch (e) {
      console.error(e);

      reject(e);
    }
  });
};
