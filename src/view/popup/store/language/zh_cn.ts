export default {
  button:{
    confirm:"确定",
    cancel:"取消",
    refuse:"拒绝",
    next:'下一步',
    delete:"删除",
  },
  toast:{
    successfully:"操作成功，请耐心等待区块确认。",
    failed:"操作失败！请稍候再次尝试。",
    copySuccess:"复制成功！"
  },
  welcome:{
    start:'开始',
    welcomeToUse:'欢迎使用',
    describe:"让NEO离你更近"
  },
  walletnew:{
    option_wif:"私钥",
    option_nep2:"Nep2",
    option_nep6:"Nep6加密文件",
    newWallet:"新钱包",
    createWallet:"创建钱包",
    importWallet:"导入钱包",
    importFrom:"导入类型",
    create:{
      createName:"为您的钱包命名",
      setPassword:"设置密码",
      confirmPassword:"确认密码",
      successfully:"钱包创建成功",
      goWallet:"请将钱包备份后再使用!",
      prikey:"私钥",
      cancel:'取消',
      confirm:'确定',
      download:"下载备份文件并继续",
      error1:"钱包名称过长",
      error2:"密码长度不得小于8位",
      error3:"两次密码不一致",
    },
    wif:{
      placeholder1:"输入私钥",
      placeholder2:"设置密码",
      placeholder3:"确认密码",
      error1:"私钥格式错误",
      error2:"密码长度不得小于8位",
      error3:"两次密码不一致",
    },
    nep2:{
      placeholder1:"输入NEP2",
      placeholder2:"输入密码",
      error1:"NEP2格式不正确",
      error2:"密码错误",
    },
    nep6:{
      placeholder1:"选择NEP6文件（.json）",
      placeholder2:"输入密码",
      error1:"文件解析异常，请使用正确的Nep6协议文件",
      error2:"密码错误",
    },
  },
  login:{
    welcome:"欢迎回来",
    goCreate:"点击这里创建或导入新钱包",
    placeholder1:"输入密码",
    button:"登录",
    error:"密码错误"
  },
  mywallet:{
    records:"交易记录",
    assets:"资产",
    mainnet:"主网",
    testnet:"测试网",
    currentnet:"网络",
    cgasExchange:"CGAS兑换",
    explorer:"区块链浏览器"
  },
  history:{
    wait:"排队中",
    tranHistory:"交易历史",
    contract:"合约交互",
    waitConfirm:"等待确认",
    failed:"交易失败",
    hide:"隐藏无花费交易",
    scriptHash:"合约hash",
    note:"备注",
    amount:"花费",
    fee:"网络费",
    presonalTransfer:"个人转账",    
    all:"全部",
    from:"来自",
    to:"发往"
  },
  exchange:{
    gasToCgas:"GAS换CGAS",
    cgasToGas:"CGAS换GAS",
    operationType:"操作类型",
    amount:"兑换数量",
    payfee:"优先确认交易(支付0.002GAS)",
    noBalance:"资产余额不足",
  },
  transfer:{
    sendTo:"发送至（地址或NNS域名）",
    amount:"发送数量",
    payfee:"优先确认交易(支付0.001GAS)",
    available:"可用",
    next:"下一步",
    title:"转账详情",
    title1:"从",
    title2:"发送",
    title3:"至",
    title4:"手续费",
    error1:"该域名不在使用中",
    error2:"请输入正确的地址"
  },
  assets:{
    receiving:"收款",
    transfer:"转账",
    assetlist:"资产列表",
    copy:"点击地址直接复制",
    manager:'管理代币',
    GasClaimable:'可提取GAS',
    claim:'提取',
    claiming:'提取中',
    message:'正在提取gas，请勿退出钱包',
    message1:'选择要显示在主页的token类型',
    message2:'请输入代币名称或哈希进行搜索',
    message3:'请先添加代币！',
    claimGas:"提取GAS",
    save:"保存"
  },
  notify:{
    message1:"想要连接到您的钱包",
    message2:"请检查您是否在正确的站点",
    from:"来自……",
    dappNote:"来自应用的备注",
    tranData:"交易数据",
    Info:"交易详情",
    tranInfo:"转账详情",
    method:"方法",
    scriptHash:"合约hash",
    toAddress:"目标地址",
    AssetsID:"资产ID"
  },
  setting:{
    successful:"操作成功",
    message:'所有应许都需要重新请求授权，才能发起交易请求。',
    clearAuthorization:'清除授权',
    clear:'清空',
    clearTx:'清空交易记录',
    autoLock:'自动上锁',
    off:'不上锁',
    second:'秒',
    minute:'分钟',
    wallet:'钱包'
  },
  editwallet:{
    display:'显示私钥',
    create:'创建钱包',
    import:'导入钱包',
    setting:'设置',
    address:'地址',
    download:'下载',
    prikey:'私钥',
    nep2key:'NEP2加密密钥',
    deletewallet:'删除钱包',
    msg1:'使用NEP2加密密钥及密码可以在其他地方打开您的钱包。',
    msg2:'您的加密密钥是：',
    msg3:'点击复制',
    msg4:'NEP6备份文件',
    msg5:'备份您的钱包，使用时将需要密码',
    msg6:'NEP6备份文件已下载,',
    msg6_2:'请妥善保存并牢记密码,',
    msg6_3:'恢复钱包时将会要求密码。',
    msg7:'显示私钥',
    msg8:'私钥是未经过加密的钱包备份，请勿泄露给他人',
    msg9:'请不要将私钥展示给任何人，拥有私钥的人可以拿走钱包里的一切',
    msg10:'输入密码以继续',
    msg11:'从钱包列表中删除当前钱包及其全部数据',
    msg12:'删除钱包会清楚本钱包的全部信息，此操作不可逆',
    msg13:'恢复帐户需要私钥或备份文件和密码，请确保你已经进行了备份',
    msg14:'确认删除本钱包？',
    msg15:'输入要删除的钱包名称以确认',
    msg16:'输入钱包密码',
    msg17:'钱包删除成功',
    msg18:'账户名错误',
  },
  about:{
    aboutas:"关于我们",
    version:"版本信息",
    website:"访问官网",
    help:"帮助",
    policy:"《 隐私政策 》",
    and:" 与 ",
    disclaimer:"《 用户协议和免责声明 》",
    url1:"https://teemo.nel.group",
    url2:"https://teemo.nel.group/qa-zh.html",
    url3:"https://teemo.nel.group/privacy-zh.html",
    url4:"https://teemo.nel.group/disclaimer-zh.html",
  }
}