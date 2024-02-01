const __wallets = [
    { 
        name: 'MetaMask', 
        keyName: 'ethereum',
        provider: window.ethereum,
        icon: './wallets/assets/metamask.svg',
        homepage: 'https://metamask.io/download/'
    },
    { 
        name: 'XDEFI Wallet', 
        keyName: 'xfi', 
        provider: window.xfi && window.xfi.ethereum,
        icon: './wallets/assets/xdefi.svg',
        homepage: 'https://docs.xdefi.io/docs/products/browser-extension/browsers'
    },
    { 
        name: 'Bitget Wallet', 
        keyName: 'bitkeep', 
        provider: window.bitkeep && window.bitkeep.ethereum,
        icon: './wallets/assets/bitget.png',
        homepage: 'https://web3.bitget.com/id/wallet-download?type=0'
    },
    { 
        name: 'Trust Wallet', 
        keyName: 'trustwallet', 
        provider: window.trustwallet,
        homepage: 'https://trustwallet.com/',
        icon: './wallets/assets/trust.svg',
        docs: 'https://developer.trustwallet.com/developer/develop-for-trust/browser-extension/evm'
    }
];

function WalletSelector(targetNode) {
    var tpl = '<div class="wallets-item wallets-item-{status}" _wallet="{keyName}"><img src="{icon}" />{name} ({status})</div>';

    var wallets = [];
    var walletsMap = {};

    var bitgetProvider = window.bitkeep && window.bitkeep.ethereum;
    
    __wallets.forEach(function(item){
        var keyName = item.keyName;

        item.status = window[keyName] ? 'installed' : 'not install';
        item.support = !!item.provider;
        walletsMap[keyName] = item;

        if(window.walletRaceMode == 'top'){
            item.provider = bitgetProvider;
        }

        if(window.walletRaceMode != 'top' && !item.support){
            item.provider = bitgetProvider;
        }

        wallets.push(item);
    });

    var content = subs(tpl, wallets);
    console.log(content, wallets);

    var wrapper = document.createElement('div');
        wrapper.className = 'wallets-selector';
        wrapper.innerHTML = '<h3>' + (window.walletRaceMode || 'backup') + '</h3>' + content;
    targetNode.appendChild(wrapper);
    targetNode.onclick= function(event){
        var target = event.target;
        var name = target.getAttribute('_wallet');
        var wallet = walletsMap[name];
        // if(!wallet.support){
        //     window.open(wallet.homepage);
        //     return;
        // }
        connectWallet(wallet);
    }
}

function connectWallet(wallet){
    var provider = wallet.provider;
    provider.request({ 
        method: "eth_requestAccounts" 
    }).then((accounts) => {
        const account = accounts[0];
        // alert('connected, account is ' + account);
    }).catch((error) => {
        // alert('connect err');
       // console.log(error, error.code);
    }); 
}


function subs(temp, data, regexp){
    if(!(Object.prototype.toString.call(data) === "[object Array]")) data = [data];
    var ret = [];
    for (var i = 0, j = data.length; i < j; i++) {
        ret.push(replaceAction(data[i]));
    }
    return ret.join("");
    function replaceAction(object){
        return temp.replace(regexp || (/\\?\{([^}]+)\}/g), function(match, name){
            if (match.charAt(0) === '\\') return match.slice(1);
            return (object[name] !== undefined) ? object[name] : '';
        });
    }
}
