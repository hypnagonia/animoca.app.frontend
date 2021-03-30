export const share = ({text = '', url = 'https://atari.harmony.one', hashtags = 'HarmonyNFTs,animoca,blockchain,gaming,NFT'}) => {
  if (!text) {
    return
  }

  const original = encodeURI(window.location.href)

  window.open(`https://twitter.com/share?hashtags=${encodeURI(hashtags)}&original_referer=${original}&text=${encodeURI(text)}&url=${encodeURI(url)}`, '_blank', 'width=550,height=420').focus();
};

//original_referer=http%3A%2F%2Flocalhost%3A3000%2F&
// ref_src=twsrc%5Etfw&text=I%20just%20bought%20%20%40animocabrands%20%23BeastQuest%20NFT%20chests%20on%20%40harmonyprotocol!%20Join%20in%20for%20your%20chance%20to%20win%2010%2C000%20%24ONE%20in%20staking%20rewards%20%F0%9F%8E%89%F0%9F%A5%B3%F0%9F%91%87%20%0A%23HarmonyNFTs%20%23animoca%20%23blockchain%20%23gaming%20%23NFT&tw_p=tweetbutton&url=http%3A%2F%2Fbquh.io