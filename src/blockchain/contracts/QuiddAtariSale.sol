pragma solidity ^0.8.3;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract QuiddAtariSale is ERC721, Ownable {
    using Counters for Counters.Counter;

    event Purchased(
        uint256 indexed newItemId,
        address indexed recipient,
        uint256 amount
    );

    Counters.Counter private _tokenIds;
    string[] private hashes;
    string public base;
    uint256 salePrice;
    uint8 total;

    constructor(
        string[] memory _hashes,
        uint256 _salePrice,
        uint8 _total
    ) public ERC721("Quidd Atari Harmony Sale", "QUIDD-ATARI-HARMONY") {
        _setBaseURI("https://ipfs.io/ipfs/");
        hashes = _hashes;
        salePrice = _salePrice;
        total = _total;
    }

    function purchaseItem(address recipient) public payable {
        require(msg.value == salePrice, "QuiddAtariSale/insufficient-price");
        require(
            recipient != address(0),
            "QuiddAtariSale/recipient is a zero address"
        );
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        require(newItemId <= total, "QuiddAtariSale/sale has ended");
        _mint(recipient, newItemId);
        _setTokenURI(newItemId, hashes[newItemId - 1]);
        emit Purchased(newItemId, recipient, salePrice);
    }

    function payout() public onlyOwner {
        msg.sender.transfer(address(this).balance);
    }
}
