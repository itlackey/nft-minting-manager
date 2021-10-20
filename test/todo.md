# Smart contract use cases

## Character Release management

- add wallet with X whitelist entires
    - must be admin
- remove X whitelist entries for a wallet
    - must be admin
    - cannot be less than 0
- set/update max supply of mint passes and characters per release
- un/pause whitelist per release
    - must be admin
- un/pause mint pass creation per release
    - must me admin
- un/pause characer minting per release
    - must be admin

## Tokens / Passes management

- create mint pass for release, transfer to sender
    - sender must have >= whitelist entires than requested passes
    - sender must transfer enough ETH to cover the cost of X passes
    - mint pass must not be paused for requested release
    - remove a whitelist entry for sender once pass is minted
- create character for requested release
    - sender must have mint pass for release
    - creation must not be paused for release
    - burn senders mint pass after minting token
- transfer ownership of a character
    - must be owner
    - must pay royalty (aka transfer fee)


## Funds

- Set withdraw address
    - must be admin
- Withdraw balance to address
    - must be admin




## Questions

* do we want to use a character contract per set or per release?
    - i think it has to be per release