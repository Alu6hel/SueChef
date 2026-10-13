import fs from 'fs';

const NEW_KEYS = {
  offlineVaultSubtitle: {
    en: "100% Offline & Private",
    hi: "100% ऑफ़लाइन और निजी",
    es: "100% Fuera de Línea y Privado",
    de: "100% Offline & Privat",
    fr: "100% Hors Ligne & Privé",
    ja: "100% 完全オフライン・秘密厳守",
    zh: "100% 本地离线与严格私密"
  },
  cancel: {
    en: "Cancel",
    hi: "रद्द करें",
    es: "Cancelar",
    de: "Abbrechen",
    fr: "Annuler",
    ja: "キャンセル",
    zh: "取消"
  },
  citation: {
    en: "Citation",
    hi: "उद्धरण",
    es: "Cita Legal",
    de: "Gesetzeszitat",
    fr: "Citation Juridique",
    ja: "法例・条文番号",
    zh: "法条引证"
  },
  activeCaseFile: {
    en: "Case",
    hi: "मामला",
    es: "Expediente",
    de: "Fallakte",
    fr: "Dossier",
    ja: "事件記録",
    zh: "案件卷宗"
  },
  tourStep2Badge: {
    en: "Damage Calculator",
    hi: "क्षति कैलकुलेटर",
    es: "Calculadora de Daños",
    de: "Schadensrechner",
    fr: "Calculateur de Dommages",
    ja: "損害賠償計算機",
    zh: "法定赔偿计算器"
  },
  tourStep3Badge: {
    en: "SHA-256 Digest",
    hi: "एसएचए-256 डाइजेस्ट",
    es: "Resumen SHA-256",
    de: "SHA-256 Hashwert",
    fr: "Empreinte SHA-256",
    ja: "SHA-256 電子署名ダイジェスト",
    zh: "SHA-256 哈希存证"
  },
  tourStep4Badge: {
    en: "CRC 2.105 Format",
    hi: "सीआरसी 2.105 प्रारूप",
    es: "Formato CRC 2.105",
    de: "CRC 2.105 Gerichtsformat",
    fr: "Format Judiciaire CRC 2.105",
    ja: "CRC 2.105 司法書式",
    zh: "CRC 2.105 诉状排版格式"
  },
  tourStep5Badge: {
    en: "Rule 408 Modeling",
    hi: "नियम 408 मॉडलिंग",
    es: "Modelado Regla 408",
    de: "Regel 408 Verhandlungsmodell",
    fr: "Modélisation Règle 408",
    ja: "第408条 和解交渉数理モデル",
    zh: "证据法第408条和解数理模型"
  },
  tourStep6Badge: {
    en: "AI Legal Audit",
    hi: "एआई कानूनी ऑडिट",
    es: "Auditoría Jurídica de IA",
    de: "KI-Rechtsgutachten",
    fr: "Audit Juridique IA",
    ja: "AI 法的監査",
    zh: "AI 司法双重审核"
  },
  tourStep7Badge: {
    en: "Verified Directory",
    hi: "सत्यापित निर्देशिका",
    es: "Directorio Verificado",
    de: "Verifiziertes Verzeichnis",
    fr: "Répertoire Vérifié",
    ja: "公認相談先名簿",
    zh: "官方认证援助名册"
  },
  decoderDefinitionSuffix: {
    en: "DEFINITION",
    hi: "परिभाषा",
    es: "DEFINICIÓN",
    de: "DEFINITION",
    fr: "DÉFINITION",
    ja: "用語定義",
    zh: "词条定义"
  },
  anArbitrationSummary: {
    en: "Mandatory Binding Arbitration & Class Action Waiver: Strips your constitutional right to take your dispute to a public court or jury.",
    hi: "अनिवार्य बाध्यकारी मध्यस्थता और वर्ग कार्रवाई छूट: सार्वजनिक अदालत या जूरी में अपना विवाद ले जाने का आपका संवैधानिक अधिकार छीनता है।",
    es: "Arbitraje Vinculante Obligatorio y Renuncia a Demanda Colectiva: Elimina su derecho constitucional a litigar ante un tribunal público o jurado.",
    de: "Verbindliches Schiedsverfahren & Sammelklageverzicht: Entzieht Ihr verfassungsmäßiges Recht auf ein ordentliches Gerichtsverfahren.",
    fr: "Arbitrage Contraignant Obligatoire & Renonciation à Recours Collectif : Vous prive du droit constitutionnel de saisir un tribunal public.",
    ja: "強制仲裁条項および集団訴訟放棄：公開裁判所での裁判を受ける憲法上の権利を剥奪する危険条項です。",
    zh: "强制具约束力仲裁与集体诉讼豁免条款：剥夺您在公开法院申请陪审团审判的法定诉讼权利。"
  },
  anArbitrationPoint1: {
    en: "You cannot file in civil court without first defeating this clause or filing a Small Claims exemption.",
    hi: "आप इस खंड को चुनौती दिए बिना या लघु दावा छूट दायर किए बिना दीवानी अदालत में याचिका दायर नहीं कर सकते।",
    es: "No puede presentar demanda civil sin invalidar primero esta cláusula o acogerse a la exención de juicios verbales/reclamos menores.",
    de: "Sie können nicht vor Zivilgerichten klagen, ohne diese Klausel abzuwehren oder eine Bagatellklage-Ausnahme geltend zu machen.",
    fr: "Vous ne pouvez pas assigner en justice sans contester cette clause ou invoquer une exception pour litiges de proximité.",
    ja: "本条項の無効を主張するか少額訴訟の例外を適用しない限り、民事本案訴訟を提起できません。",
    zh: "若未成功主张该条款无效或申请小额法庭豁免，您将无法直接提起民事诉讼。"
  },
  anArbitrationPoint2: {
    en: "Arbitration filing fees often cost $1,500–$5,000+ upfront (though consumer exemption rules under AAA/JAMS may cap consumer share at $250).",
    hi: "मध्यस्थता शुल्क अक्सर $1,500–$5,000+ अग्रिम होता है (हालांकि उपभोक्ता छूट नियमों के तहत उपभोक्ता अंश $250 तक सीमित हो सकता है)।",
    es: "Las tasas de arbitraje suelen costar $1,500–$5,000+ por adelantado (aunque las normas de consumo de AAA/JAMS suelen limitar la parte del consumidor a $250).",
    de: "Die Einleitungsgebühren für Schiedsverfahren betragen oft 1.500 bis über 5.000 $ (Verbraucherregeln deckeln den Eigenanteil teils auf 250 $).",
    fr: "Les frais d'arbitrage initiaux s'élèvent souvent à 1 500 – 5 000 $+ (bien que les règles de protection des consommateurs puissent plafonner la part à 250 $).",
    ja: "仲裁申立費用は前払いで1,500〜5,000ドル以上かかる場合があります（消費者保護規定により消費者の自己負担は250ドルに制限される場合もあります）。",
    zh: "仲裁立案规费初期通常高达1,500至5,000美元以上（但在消费者保护协议下，个人自付份额通常被上限封顶在250美元）。"
  },
  anArbitrationPoint3: {
    en: "Arbitration proceedings are private and have extremely limited appeal rights compared to court judgments.",
    hi: "मध्यस्थता की कार्यवाही गोपनीय होती है और अदालती फैसलों की तुलना में अपील के अधिकार अत्यंत सीमित होते हैं।",
    es: "Los procedimientos de arbitraje son privados y tienen vías de recurso y apelación sumamente limitadas frente a sentencias judiciales.",
    de: "Schiedsverfahren sind nicht-öffentlich und bieten im Vergleich zu Gerichtsurteilen extrem eingeschränkte Rechtsmittel.",
    fr: "Les procédures arbitrales sont confidentielles et les voies de recours sont très restreintes comparées aux jugements judiciaires.",
    ja: "仲裁手続は非公開であり、通常の裁判判決と比較して不服申立て・上訴の機会が著しく制限されます。",
    zh: "仲裁审理属于私密闭门程序，且相较于正式法庭判决，当事人的上诉抗告途径极其受限。"
  },
  anArbitrationAct1: {
    en: "Check if the contract provides an opt-out window (usually 30 days from signing).",
    hi: "जांचें कि क्या अनुबंध ऑप्ट-आउट विंडो प्रदान करता है (हस्ताक्षर से आमतौर पर 30 दिन)।",
    es: "Verifique si el contrato otorga un plazo de desistimiento u opción de exclusión (normalmente 30 días tras la firma).",
    de: "Prüfen Sie, ob der Vertrag eine Widerspruchsfrist vorsieht (üblicherweise 30 Tage ab Unterzeichnung).",
    fr: "Vérifiez si le contrat prévoit un délai de rétractation (généralement 30 jours après la signature).",
    ja: "契約に除外申請（オプトアウト）期間が定められているか確認してください（通常は署名後30日以内）。",
    zh: "核实合同文本中是否存在书面退出仲裁的保留期（通常为签署后的30日内）。"
  },
  anArbitrationAct2: {
    en: "Check if the clause explicitly exempts Small Claims Court disputes (most standardized adhesion contracts do).",
    hi: "जांचें कि क्या यह खंड स्पष्ट रूप से लघु दावा न्यायालय विवादों को छूट देता है (अधिकांश मानक अनुबंध ऐसा करते हैं)।",
    es: "Compruebe si la cláusula exime expresamente los litigios de reclamos menores/juicio verbal (la mayoría de contratos de adhesión lo hacen).",
    de: "Prüfen Sie, ob Bagatell- und Schlichtungsgerichte ausdrücklich ausgenommen sind (in den meisten AGB der Fall).",
    fr: "Vérifiez si la clause exclut explicitement les tribunaux de proximité et petits litiges (cas fréquent dans les contrats d'adhésion).",
    ja: "少額訴訟裁判所での紛争が適用除外として明記されているか確認してください（多くの標準約款で除外されています）。",
    zh: "查阅该条款是否明确将小额钱债法庭（Small Claims Court）排除在外（绝大多数标准格式合同均有此豁免）。"
  },
  anArbitrationAct3: {
    en: "Assert unconscionability if arbitration fees exceed total dispute value or terms are buried in tiny non-negotiable print.",
    hi: "यदि मध्यस्थता शुल्क कुल विवाद मूल्य से अधिक है या शर्तें छोटे अक्षरों में दबी हैं तो अनुचितता का दावा करें।",
    es: "Alegue abusividad y desequilibrio contractual manifiesto si las tasas arbitrales superan la cuantía del litigio o las cláusulas estaban ocultas.",
    de: "Machen Sie Sittenwidrigkeit geltend, wenn die Verfahrenskosten den Streitwert übersteigen oder Klauseln überraschend versteckt wurden.",
    fr: "Invoquez le caractère abusif si les frais d'arbitrage dépassent le montant du litige ou si la clause était dissimulée.",
    ja: "仲裁費用が請求総額を上回る場合や、交渉不可能な極小フォントで隠蔽されていた場合は、公序良俗違反・不当条項を主張してください。",
    zh: "若仲裁费用超过争议标的金额或条款被恶意隐藏在不可协商的格式微缩字体中，应坚决主张该条款显失公平且自始无效。"
  },
  anIndemnitySummary: {
    en: "Unilateral Indemnification & Hold Harmless: Forces you to pay the other party's legal bills, liabilities, or losses.",
    hi: "एकतरफा क्षतिपूर्ति और दायित्वमुक्ति: आपको दूसरे पक्ष के कानूनी बिल, देनदारियों या नुकसान का भुगतान करने के लिए मजबूर करता है।",
    es: "Indemnización Unilateral y Exoneración de Responsabilidad: Le obliga a pagar los gastos legales, reclamaciones o pérdidas de la otra parte.",
    de: "Einseitige Freistellungserklärung: Verpflichtet Sie, Anwaltskosten und Haftungen der Gegenpartei zu übernehmen.",
    fr: "Indemnisation Unilatérale & Garantie de Non-Recours : Vous oblige à payer les frais de justice et pertes de l'autre partie.",
    ja: "一方的補償および免責特約：相手方の訴訟費用や損害賠償責任をこちら側に全額負担させる有害条項です。",
    zh: "单方赔偿与免责背书条款：强制要求您全额承担对方当事人的律师费、法律责任及连带损失。"
  },
  anIndemnityPoint1: {
    en: "Extremely dangerous if unreciprocal and placed in standard consumer or tenant contracts.",
    hi: "यदि गैर-पारस्परिक है और मानक उपभोक्ता या किरायेदार अनुबंधों में रखा गया है तो बेहद खतरनाक है।",
    es: "Extremadamente peligrosa si carece de reciprocidad y figura en contratos estándar de consumo o arrendamiento.",
    de: "Äußerst riskant, wenn keine Gegenseitigkeit besteht und sie in Standard-Verbraucher- oder Mietverträgen steht.",
    fr: "Extrêmement dangereuse si elle n'est pas réciproque et insérée dans des contrats types de consommation ou de bail.",
    ja: "相互義務がなく、一般的な消費者契約や賃貸借約款に記載されている場合は極めて危険です。",
    zh: "若非对等互惠条款且出现在通用格式消费者合同或租约中，具有极高法律风险。"
  },
  anIndemnityPoint2: {
    en: "Could make you financially liable for damages caused entirely by the other party.",
    hi: "यह आपको पूरी तरह से दूसरे पक्ष द्वारा किए गए नुकसान के लिए वित्तीय रूप से उत्तरदायी बना सकता है।",
    es: "Podría hacerle económicamente responsable de daños ocasionados exclusivamente por la contraparte.",
    de: "Könnte Sie für Schäden haftbar machen, die gänzlich von der Gegenpartei verursacht wurden.",
    fr: "Pourrait vous rendre financièrement responsable de préjudices causés exclusivement par l'autre partie.",
    ja: "相手方自身の過失によって引き起こされた損害であっても、こちらが金銭的責任を負わされる恐れがあります。",
    zh: "可能导致您被迫为完全由对方过错造成的损害承担全部经济赔偿责任。"
  },
  anIndemnityAct1: {
    en: "Review whether the indemnity extends to their own gross negligence or willful misconduct (which is void as a matter of public policy in almost all jurisdictions).",
    hi: "जांचें कि क्या क्षतिपूर्ति उनकी अपनी घोर लापरवाही या जानबूझकर किए गए दुराचार तक फैली है (जो लगभग सभी क्षेत्रों में शून्य है)।",
    es: "Examine si la exoneración cubre negligencia grave o dolo de la contraparte (lo cual es nulo de pleno derecho en casi todas las jurisdicciones).",
    de: "Prüfen Sie, ob grobe Fahrlässigkeit oder Vorsatz freigestellt werden soll (was nach geltendem Recht fast ausnahmslos nichtig ist).",
    fr: "Vérifiez si l'indemnisation couvre leur propre faute lourde ou dol (nul d'ordre public dans la quasi-totalité des juridictions).",
    ja: "相手方自身の重過失や故意による不法行為まで免責対象に含まれているか確認してください（公序良俗に基づきほぼ無効です）。",
    zh: "核实该免责条款是否涵盖其自身的重大过失或故意不当行为（在绝大多数司法管辖区中此类条款均自始无效）。"
  },
  anIndemnityAct2: {
    en: "Argue that unilateral indemnity clauses in consumer adhesion contracts violate statutory consumer protection acts.",
    hi: "तर्क दें कि उपभोक्ता अनुबंधों में एकतरफा क्षतिपूर्ति खंड वैधानिक उपभोक्ता संरक्षण कानूनों का उल्लंघन करते हैं।",
    es: "Alegue que las cláusulas de indemnización unilateral en contratos de adhesión violan las leyes de protección a consumidores y usuarios.",
    de: "Machen Sie geltend, dass einseitige Freistellungen in Verbraucherverträgen gegen AGB- und Verbraucherschutzgesetze verstoßen.",
    fr: "Soutenez que les clauses d'indemnisation unilatérales dans les contrats d'adhésion violent les lois sur la protection des consommateurs.",
    ja: "付合契約における一方的な免責条項は消費者契約法等の保護規定に明白に違反していると主張してください。",
    zh: "依法主张格式附合合同中的单方索赔保证条款直接违反了法定的消费者权益保护法。"
  },
  anLiquidatedSummary: {
    en: "Liquidated Damages Clause: Pre-determines the exact dollar penalty you pay if a breach occurs.",
    hi: "परिनिर्धारित क्षतिपूर्ति खंड: उल्लंघन होने पर आपके द्वारा भुगतान किए जाने वाले सटीक जुर्माने को पूर्व-निर्धारित करता है।",
    es: "Cláusula Penal / Daños Liquidados: Prefija la sanción económica exacta a abonar en caso de incumplimiento.",
    de: "Vertragsstrafeklausel: Legt die genaue Entschädigungssumme fest, die bei Vertragsverletzung fällig wird.",
    fr: "Clause Pénale / Dommages Forfaitaires : Fixe à l'avance le montant exact des pénalités financières dues en cas d'inexécution.",
    ja: "損害賠償額の予定条項：債務不履行が発生した場合に支払うべき違約金の金額を事前に固定する条項です。",
    zh: "预定违约金条款：在违约事实发生前预先固定您须支付的具体违约金数额。"
  },
  anLiquidatedPoint1: {
    en: "Courts will strike down liquidated damages if they constitute an illegal punitive penalty rather than a reasonable pre-estimate of actual anticipated loss.",
    hi: "अदालतें परिनिर्धारित क्षतियों को खारिज कर देंगी यदि वे वास्तविक प्रत्याशित नुकसान के उचित पूर्व-अनुमान के बजाय अवैध दंडात्मक जुर्माना हैं।",
    es: "Los tribunales anulan estas cláusulas si constituyen una sanción punitiva desproporcionada en lugar de una estimación razonable del daño real anticipado.",
    de: "Gerichte erklären Vertragsstrafen für unwirksam, wenn sie einen unverhältnismäßigen Strafcharakter haben statt eines realistischen Schadensausgleichs.",
    fr: "Les tribunaux annulent ou réduisent la clause pénale si elle présente un caractère manifestement excessif et punitif.",
    ja: "損害額の合理的な事前見積もりではなく過大な懲罰的制裁とみなされる場合、裁判所により違約金条項が無効化または減額されます。",
    zh: "若该违约金构成惩罚性重罚而非对预期实际损失的合理预估，法院将依法判令其不具有执行力或予以酌情调减。"
  },
  anLiquidatedPoint2: {
    en: "If the actual damages are readily ascertainable, fixed contractual penalties are frequently unenforceable.",
    hi: "यदि वास्तविक नुकसान का आसानी से पता लगाया जा सकता है, तो निश्चित संविदात्मक दंड अक्सर अप्रवर्तनीय होते हैं।",
    es: "Si los daños reales se pueden calcular con facilidad, las penalizaciones fijas desproporcionadas suelen ser legalmente inaplicables.",
    de: "Wenn der tatsächliche Schaden leicht bezifferbar ist, sind pauschale Vertragsstrafen häufig unzulässig.",
    fr: "Si le préjudice réel est facilement quantifiable, les pénalités forfaitaires fixes sont fréquemment déclarées inapplicables.",
    ja: "実際の損害額が容易に算定可能である場合、定額の違約金約定は法的効力を否定されるケースが多くあります。",
    zh: "若违约造成的实际损失能够被简易确切核实，合同中过高的固定违约罚金往往不具法律强制执行力。"
  },
  anLiquidatedAct1: {
    en: "Compare the claimed penalty amount against the other party's actual direct out-of-pocket costs.",
    hi: "दावा की गई जुर्माना राशि की तुलना दूसरे पक्ष की वास्तविक प्रत्यक्ष लागत से करें।",
    es: "Compare la cuantía exigida con los costes directos reales y demostrables desembolsados por la otra parte.",
    de: "Vergleichen Sie die geforderte Summe mit den tatsächlichen Auslagen und dem nachweisbaren Schaden der Gegenpartei.",
    fr: "Comparez le montant réclamé avec les débours et coûts réels effectivement subis par l'autre partie.",
    ja: "請求されている違約金額と、相手方が実際に被った直接的な実費・損害額を対比してください。",
    zh: "将对方主张的违约金数额与其真实发生的实际直接经济自付支出进行逐项比对。"
  },
  anLiquidatedAct2: {
    en: "Demand itemized accounting and receipts proving their actual damages.",
    hi: "उनके वास्तविक नुकसान को साबित करने वाले विस्तृत विवरण और रसीदों की मांग करें।",
    es: "Exija facturas desglosadas, justificantes y contabilidad detallada que demuestren el daño económico real.",
    de: "Fordern Sie eine detaillierte Kostenaufstellung und Belege an, die den echten Schaden beweisen.",
    fr: "Exigez des factures détaillées et des pièces justificatives prouvant la réalité de leur préjudice.",
    ja: "相手方に対し、実際の損害を客観的に証明する明細書および領収書の提出を要求してください。",
    zh: "正式发函要求对方提供经审计的明细账目及正式发票收据，以举证其实际所受损失。"
  },
  anAsIsSummary: {
    en: "'As-Is' & Warranty Disclaimers: Attempts to sell goods or property without legal recourse for defects.",
    hi: "'जैसा है वैसा' और वारंटी अस्वीकरण: दोषों के लिए कानूनी उपाय के बिना सामान या संपत्ति बेचने का प्रयास।",
    es: "Cláusula 'Tal Cual' (As-Is) y Renuncia de Garantías: Intenta transmitir bienes o inmuebles sin responder por vicios ocultos.",
    de: "Ausschluss der Sachmängelhaftung ('Gekauft wie gesehen'): Versuch, Waren ohne Gewährleistung für Mängel zu veräußern.",
    fr: "Clause 'En l'État' & Exclusion de Garantie : Tentative de vente sans recours légal pour vices cachés.",
    ja: "現状有姿売買および瑕疵担保責任免除条項：隠れた欠陥に対する法的追及を遮断しようとする免責特約です。",
    zh: "“按现状交付”与质量保证豁免条款：企图在排除对隐蔽瑕疵承担法定责任的前提下销售商品或物业。"
  },
  anAsIsPoint1: {
    en: "Does NOT protect the seller from affirmative intentional fraud, active concealment of material defects, or statutory disclosure duties.",
    hi: "विक्रेता को जानबूझकर की गई धोखाधड़ी, दोषों को छिपाने या कानूनी प्रकटीकरण कर्तव्यों से नहीं बचाता है।",
    es: "NO ampara al vendedor frente a dolo, fraude intencional, ocultación activa de vicios graves o deberes legales de información.",
    de: "Schützt den Verkäufer NICHT vor arglistiger Täuschung, aktiver Mängelverschleierung oder gesetzlichen Offenbarungspflichten.",
    fr: "Ne protège PAS le vendeur en cas de dol, dissimulation délibérée de défauts majeurs ou manquement aux obligations légales d'information.",
    ja: "売主による積極的な詐欺行為、重大な欠陥の悪意ある隠蔽、または法令上の告知義務違反までは免責されません。",
    zh: "绝不能免除出卖人故意的欺诈行为、对重大隐蔽瑕疵的恶意隐瞒或法定强制性告知义务。"
  },
  anAsIsPoint2: {
    en: "Many states prohibit as-is clauses in consumer transactions or require conspicuous magical statutory phrasing.",
    hi: "कई राज्य उपभोक्ता लेन-देन में इस तरह के खंडों को प्रतिबंधित करते हैं या विशिष्ट वैधानिक भाषा की आवश्यकता होती है।",
    es: "Múltiples normativas prohíben exoneraciones 'en el estado en que se encuentre' con consumidores o exigen redacción destacada y específica.",
    de: "Das Verbraucherrecht untersagt den Ausschluss der Gewährleistung bei Verbrauchsgüterkäufen weitgehend.",
    fr: "La législation interdit les clauses exclusives de garantie des vices cachés au détriment des consommateurs.",
    ja: "消費者契約において瑕疵担保責任を全面的に排除する特約は多くの法域で無効とされています。",
    zh: "许多法域严格禁止在涉及消费者的交易中使用此类免责条款，或要求必须以极其醒目的法定规范用语书写。"
  },
  anAsIsAct1: {
    en: "Document all written text messages, emails, or listings where the seller made affirmative oral promises.",
    hi: "सभी लिखित संदेशों, ईमेलों या विज्ञापनों को दस्तावेज़ित करें जहाँ विक्रेता ने मौखिक वादे किए थे।",
    es: "Guarde todos los mensajes de texto, correos o anuncios donde el vendedor afirmó verbalmente el buen estado del bien.",
    de: "Sichern Sie alle Textnachrichten, E-Mails oder Inserate, in denen der Verkäufer Zusicherungen gemacht hat.",
    fr: "Conservez tous les SMS, courriels ou annonces dans lesquels le vendeur a fait des déclarations positives.",
    ja: "売主が口頭または文書で性能や品質を明言したメッセージ、電子メール、広告記録をすべて保存してください。",
    zh: "完整留存出卖人在短信、电子邮件或广告物料中做出肯定性承诺和品质保证的全部记录证据。"
  },
  anAsIsAct2: {
    en: "Obtain a certified mechanic or home inspector report showing pre-existing latent defects.",
    hi: "प्रमाणित मैकेनिक या होम इंस्पेक्टर की रिपोर्ट प्राप्त करें जो पहले से मौजूद अंतर्निहित दोषों को दर्शाती हो।",
    es: "Consiga un informe pericial de mecánico colegiado o inspector técnico que demuestre la preexistencia del vicio oculto.",
    de: "Holen Sie ein Gutachten eines Fachmanns oder Sachverständigen ein, das das Vorliegen verdeckter Mängel belegt.",
    fr: "Obtenez un rapport d'expertise certifié prouvant l'existence antérieure de vices cachés.",
    ja: "認定技術者または専門検査員による鑑定書を取得し、契約前から存在していた隠れた欠陥を立証してください。",
    zh: "委托持牌专业机械师或房屋检验鉴定师出具证明在交易前即已存在隐蔽瑕疵的正式检测报告。"
  },
  anReleaseSummary: {
    en: "Exculpatory Liability Waiver: Attempting to extinguish all legal liability for personal injuries or property damage.",
    hi: "दायित्व छूट: व्यक्तिगत चोटों या संपत्ति के नुकसान के लिए सभी कानूनी दायित्वों को समाप्त करने का प्रयास।",
    es: "Exención General de Responsabilidad: Intenta extinguir cualquier reclamo civil por lesiones corporales o daños patrimoniales.",
    de: "Haftungsausschluss: Versuch, jegliche Haftung für Personen- oder Sachschäden vollständig auszuschließen.",
    fr: "Clause Exonératoire de Responsabilité : Tentative d'éteindre toute responsabilité pour dommages corporels ou matériels.",
    ja: "免責・権利放棄約定：人身傷害や財産損害に対する一切の損害賠償請求権を事前放棄させようとする条項です。",
    zh: "全面免责声明与索赔豁免条项：企图提前消灭因人身伤害或财产受损而产生的一切法定损害赔偿请求权。"
  },
  anReleasePoint1: {
    en: "Clauses attempting to exempt a party from liability for gross negligence, willful injury, or statutory violations are strictly VOID.",
    hi: "घोर लापरवाही, जानबूझकर की गई चोट, या वैधानिक उल्लंघनों के लिए दायित्व से छूट देने का प्रयास करने वाले खंड पूरी तरह से शून्य हैं।",
    es: "Las cláusulas que pretenden exonerar de responsabilidad por dolo, culpa grave o infracción de normas imperativas son radicalmente NULAS.",
    de: "Klauseln, die die Haftung für grobe Fahrlässigkeit, vorsätzliche Schädigung oder Gesetzesverstöße ausschließen, sind NICHTIG.",
    fr: "Les clauses exonérant l'auteur d'une faute lourde, d'une atteinte corporelle ou d'un dol sont formellement NULLES.",
    ja: "重過失、故意による傷害、または法令違反に対する責任を免除する旨の条項は絶対的に無効です。",
    zh: "任何企图免除因重大过失、故意侵权人身伤害或违反强制性法律规范而产生之责任的条款，依法绝对无效。"
  },
  anReleaseAct1: {
    en: "Establish that the opposing party exhibited gross negligence (a conscious, voluntary act or omission in reckless disregard of consequences).",
    hi: "स्थापित करें कि विरोधी पक्ष ने घोर लापरवाही दिखाई (परिणामों की उपेक्षा में एक सचेत, स्वैच्छिक कार्य या चूक)।",
    es: "Acredite que la contraparte incurrió en negligencia temeraria o culpa grave (acto u omisión voluntaria con desprecio del riesgo evidente)." ,
    de: "Weisen Sie nach, dass die Gegenseite grob fahrlässig gehandelt hat (rücksichtslose Pflichtverletzung).",
    fr: "Établissez que la partie adverse a commis une faute lourde (acte ou omission consciente au mépris du danger).",
    ja: "相手方が重過失（結果の発生を予見できたにもかかわらず著しく配慮を怠った行為または不作為）を犯した事実を立証してください。",
    zh: "充分举证对方当事人的行为构成重大过失（明知潜在危害而置之不理的严重失职作为或不作为）。"
  },
  anAccessSummary: {
    en: "Landlord Right of Entry / Notice Waiver: Landlord attempting to enter leased premises without statutory advance notice.",
    hi: "मकान मालिक का प्रवेश अधिकार / नोटिस छूट: मकान मालिक बिना वैधानिक अग्रिम सूचना के परिसर में प्रवेश करने का प्रयास कर रहा है।",
    es: "Derecho de Entrada del Arrendador sin Preaviso: Intento del propietario de acceder al inmueble sin respetar el plazo legal de notificación.",
    de: "Zutrittsrecht des Vermieters / Fristverzicht: Versuch des Vermieters, Mieträume ohne gesetzliche Vorankündigung zu betreten.",
    fr: "Droit d'Entrée du Bailleur sans Préavis : Tentative du propriétaire d'entrer dans les lieux loués sans respecter le délai légal.",
    ja: "賃貸人の無断立入り条項：事前告知なしに賃貸借物件内へ無断侵入することを認める有害条項です。",
    zh: "房东入户搜查与免预先通知条款：出租人企图在未依法出具合理提前通知的情况下强行进入租赁房屋。"
  },
  anAccessPoint1: {
    en: "Statutory entry rules are non-waivable. Landlords MUST give reasonable written notice (typically 24 hours) during normal business hours.",
    hi: "प्रवेश नियम गैर-छूट योग्य हैं। मकान मालिकों को सामान्य व्यावसायिक घंटों के दौरान उचित लिखित नोटिस (आमतौर पर 24 घंटे) देना होगा।",
    es: "Las normas sobre inviolabilidad del domicilio y preaviso son de orden público e irrenunciables. Se exige preaviso por escrito (habitualmente 24 horas).",
    de: "Das Hausrecht des Mieters ist unantastbar. Vermieter MÜSSEN rechtzeitig schriftlich (meist mindestens 24–48 Stunden) ankündigen.",
    fr: "Le droit à la jouissance paisible est d'ordre public. Le bailleur DOIT notifier son passage par écrit (généralement 24 à 48 heures avant).",
    ja: "住居の不可侵と平穏保有権は放棄不能です。賃貸人は平日の営業時間内に書面による事前予告（通常24時間以上前）を行う法的義務があります。",
    zh: "承租人合法安宁居住权不得放弃。房东必须于正常营业时间内送达合理的书面提前通知（通常须提前24小时）。"
  },
  anAccessAct1: {
    en: "Cite statutory quiet enjoyment rights and non-waivability provisions.",
    hi: "वैधानिक शांत आनंद अधिकारों और गैर-छूट योग्य प्रावधानों का हवाला दें।",
    es: "Invoque el derecho al disfrute pacífico del arrendamiento y la nulidad de cualquier renuncia a la inviolabilidad del domicilio.",
    de: "Berufen Sie sich auf den verfassungsrechtlichen Schutz der Wohnung und die zwingenden mietrechtlichen Schutzvorschriften.",
    fr: "Invoquez le droit légal à la jouissance paisible des lieux et la nullité absolue des clauses contraires.",
    ja: "平穏享受権および事前通知義務の放棄無効を定めた法令条文を明確に引用して抗弁してください。",
    zh: "书面援引租赁安宁居住权法定条款及该权利具有不可放弃性的法律依据予以严正抗辩。"
  },
  anStandardSummary: {
    en: "Standard Contractual Covenant: Outlines baseline operational duties or general procedural provisions.",
    hi: "मानक संविदात्मक समझौता: आधारभूत परिचालन कर्तव्यों या सामान्य प्रक्रियात्मक प्रावधानों की रूपरेखा।",
    es: "Pacto Contractual Ordinario: Define obligaciones operativas básicas o disposiciones procesales generales.",
    de: "Allgemeine Vertragspflicht: Beschreibt grundlegende Leistungspflichten oder formelle Bestimmungen.",
    fr: "Clause Contractuelle Standard : Définit les obligations opérationnelles de base ou les dispositions procédurales générales.",
    ja: "標準的契約条項：基本的な履行義務または一般的手続規定を定めた条項です。",
    zh: "标准合同约定规范：阐述基础履行义务或通常性程序规范条款。"
  },
  anStandardPoint1: {
    en: "Ensure both parties have reciprocal obligations under the plain wording.",
    hi: "सुनिश्चित करें कि स्पष्ट शब्दों के तहत दोनों पक्षों के पारस्परिक दायित्व हैं।",
    es: "Asegúrese de que el texto reconozca obligaciones recíprocas y equilibradas para ambas partes.",
    de: "Stellen Sie sicher, dass der Wortlaut für beide Vertragsparteien ausgewogene Pflichten festlegt.",
    fr: "Veillez à ce que les termes clairs établissent des obligations réciproques et équilibrées pour les deux parties.",
    ja: "条項の文面において双方に公平な対価・相互義務が課されているか確認してください。",
    zh: "依照字面文义确认双方法律权利与义务具有明确对等性与合理互惠性。"
  },
  anStandardAct1: {
    en: "Maintain time-stamped records of compliance.",
    hi: "अनुपालन के समय-मुद्रित रिकॉर्ड बनाए रखें।",
    es: "Conserve registros fehacientes y con fecha y hora de todo cumplimiento contractual.",
    de: "Führen Sie lückenlose, datierte Aufzeichnungen über die ordnungsgemäße Erfüllung.",
    fr: "Conservez des preuves horodatées attestant du respect scrupuleux de vos obligations.",
    ja: "合意事項を履行したことを証明するタイムスタンプ付きの客観的記録を保存してください。",
    zh: "妥善保管附带准确时间戳的履约交付与合规履行客观记录证据。"
  }
};

let i18nContent = fs.readFileSync('src/services/i18n.ts', 'utf8');

const LOCALES = ['en', 'hi', 'es', 'de', 'fr', 'ja', 'zh'];

LOCALES.forEach(loc => {
  let injection = `\n    // Enriched 42 Missing Keys (${loc})\n`;
  for (const [key, map] of Object.entries(NEW_KEYS)) {
    injection += `    ${key}: ${JSON.stringify(map[loc])},\n`;
  }

  // Find the end of this locale's object
  // Each locale in `translations` has `loc: {` ... `},`
  // We can match `loc: {` and find where its corresponding `}` is before the next locale or closing of translations
  const regex = new RegExp(`(${loc}:\\s*\\{[\\s\\S]*?)((\\n\\s*\\},)|(\\n\\s*\\}\\s*;))`, 'm');
  const match = i18nContent.match(regex);
  if (match) {
    // Replace by inserting injection before the closing `},`
    const updated = match[1] + injection + match[2];
    i18nContent = i18nContent.replace(match[0], updated);
    console.log(`Successfully injected 42 keys into locale: ${loc}`);
  } else {
    console.error(`Could not find anchor for locale: ${loc}`);
  }
});

fs.writeFileSync('src/services/i18n.ts', i18nContent, 'utf8');
console.log("Updated src/services/i18n.ts!");
