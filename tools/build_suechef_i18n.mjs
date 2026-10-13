import fs from 'fs';
import path from 'path';

// Complete dictionary with full parity across all 7 supported languages
const dictionary = {
  decoderTitle: {
    "en": "Plain-English Legal Decoder & Clause Analyzer",
    "hi": "सरल-अंग्रेजी कानूनी डिकोडर एवं खंड विश्लेषक",
    "es": "Decodificador Legal en Lenguaje Claro y Analizador de Cláusulas",
    "de": "Juristischer Klartext-Übersetzer & Vertragsklausel-Analysator",
    "fr": "Décodeur Juridique en Langage Clair & Analyseur de Clauses",
    "ja": "平易な法律用語翻訳＆契約条項アナライザー",
    "zh": "通俗法律用语解析与合同条款风险评估"
},
  decoderSubtitle: {
    "en": "Paste confusing boilerplate contract clauses or search our 300+ term plain-English legal lexicon to reveal tactical procedural defenses.",
    "hi": "जटिल अनुबंध खंड चिपकाएं या सामरिक प्रक्रियात्मक बचाव खोजने के लिए कानूनी शब्दावली खोजें।",
    "es": "Pegue cláusulas confusas de contratos o busque en nuestro léxico legal para descubrir defensas procesales tácticas.",
    "de": "Fügen Sie unklare Vertragsklauseln ein oder durchsuchen Sie das Rechtslexikon, um verfahrensrechtliche Einreden zu erkennen.",
    "fr": "Collez des clauses contractuelles complexes ou parcourez le lexique pour révéler des défenses procédurales tactiques.",
    "ja": "複雑な契約条項を貼り付けるか、法律用語辞書を検索して手続き上の防御策を確認できます。",
    "zh": "粘贴复杂的合同格式条款，或检索通俗法律词典以发现诉讼防御抗辩要点。"
},
  decoderZeroCloud: {
    "en": "Zero Cloud • On-Device Neural Parsing",
    "hi": "शून्य क्लाउड • ऑन-डिवाइस तंत्रिका विश्लेषण",
    "es": "Cero Nube • Análisis Neural en el Dispositivo",
    "de": "Keine Cloud • Neuronale On-Device-Analyse",
    "fr": "Zéro Cloud • Analyse Neurale sur l’Appareil",
    "ja": "完全オフライン・端末内ニューラル解析",
    "zh": "完全离线 • 端侧神经语义解析"
},
  decoderInputTitle: {
    "en": "Paste Contract Clause / Boilerplate Legalese",
    "hi": "अनुबंध खंड / कानूनी भाषा चिपकाएं",
    "es": "Pegar Cláusula de Contrato / Jerga Legal",
    "de": "Vertragsklausel / Juristendeutsch einfügen",
    "fr": "Coller une Clause Contractuelle / Jargon Juridique",
    "ja": "契約条項・難解な法律文章を貼り付け",
    "zh": "粘贴合同条款或晦涩法律术语"
},
  decoderPlaceholder: {
    "en": "Paste arbitration clauses, liquidated damages provisions, indemnification covenants, or lease agreements here...",
    "hi": "मध्यस्थता खंड, परिनिर्धारित हर्जाना, क्षतिपूर्ति शर्तें यहाँ चिपकाएं...",
    "es": "Pegue aquí cláusulas de arbitraje, daños liquidados, convenios de indemnización o contratos de arrendamiento...",
    "de": "Fügen Sie Schiedsklauseln, Vertragsstrafen, Freistellungsvereinbarungen oder Mietverträge hier ein...",
    "fr": "Collez ici les clauses d’arbitrage, pénalités forfaitaires, indemnités ou contrats de bail...",
    "ja": "仲裁条項、損害賠償額の予定、補償合意、賃貸借契約の条文などをここに貼り付けてください...",
    "zh": "在此粘贴仲裁条款、预定违约金条款、单方赔偿保证或租赁协议条款..."
},
  decoderLoadSamples: {
    "en": "Load Common Toxic Boilerplate Clauses:",
    "hi": "सामान्य जोखिम भरे अनुबंध खंड लोड करें:",
    "es": "Cargar Cláusulas Abusivas Habituales:",
    "de": "Typische riskante Vertragsklauseln laden:",
    "fr": "Charger des Clauses Pièges Fréquentes :",
    "ja": "典型的な不利条項のサンプルを読み込む：",
    "zh": "加载常见霸王条款与风险样本："
},
  btnClearInput: {
    "en": "Clear Input",
    "hi": "इनपुट साफ़ करें",
    "es": "Borrar Texto",
    "de": "Eingabe löschen",
    "fr": "Effacer",
    "ja": "入力をクリア",
    "zh": "清除内容"
},
  btnDecodeClause: {
    "en": "Decode & Analyze Clause",
    "hi": "डिकोड करें और खंड का विश्लेषण करें",
    "es": "Decodificar y Analizar Cláusula",
    "de": "Klausel entschlüsseln & analysieren",
    "fr": "Décoder & Analyser la Clause",
    "ja": "条項を翻訳・リスク解析",
    "zh": "通俗解析并评估条款风险"
},
  decoderRiskAssessment: {
    "en": "RISK ASSESSMENT: {riskLevel} LEVEL TRAP",
    "hi": "जोखिम मूल्यांकन: {riskLevel} स्तर का जाल",
    "es": "EVALUACIÓN DE RIESGO: TRAMPA DE NIVEL {riskLevel}",
    "de": "RISIKOBEWERTUNG: KLAUSELFALLE STUFE {riskLevel}",
    "fr": "ÉVALUATION DU RISQUE : PIÈGE DE NIVEAU {riskLevel}",
    "ja": "リスク評価：危険度【{riskLevel}】の条項トラップ",
    "zh": "法律风险评估：{riskLevel} 级陷阱条款"
},
  decoderProceduralDefense: {
    "en": "Procedural Defense Analysis",
    "hi": "प्रक्रियात्मक रक्षा विश्लेषण",
    "es": "Análisis de Defensa Procesal",
    "de": "Verfahrensrechtliche Einredeanalyse",
    "fr": "Analyse de Défense Procédurale",
    "ja": "民事訴訟手続き上の防御策分析",
    "zh": "民事程序抗辩策略分析"
},
  decoderTrapsTitle: {
    "en": "Key Legal Traps & Risks",
    "hi": "प्रमुख कानूनी जाल और जोखिम",
    "es": "Trampas y Riesgos Legales Clave",
    "de": "Wesentliche rechtliche Risiken & Fallen",
    "fr": "Pièges et Risques Juridiques Majeurs",
    "ja": "主な法的落とし穴とリスク",
    "zh": "核心法律陷阱与履约风险"
},
  decoderActionsTitle: {
    "en": "Pro Se Rebuttal Action Items",
    "hi": "स्व-प्रतिनिधित्व खंडन कार्य बिंदु",
    "es": "Puntos de Acción para Refutación Pro Se",
    "de": "Konkrete Gegenmaßnahmen für Selbstvertreter",
    "fr": "Actions Concrètes de Réfutation Pro Se",
    "ja": "本人訴訟（プロセ）での具体的な対抗手段",
    "zh": "当事人诉讼反驳与行动要点"
},
  decoderStatutoryDefense: {
    "en": "Statutory Authority & Voidance Standard: {statute}",
    "hi": "वैधानिक अधिकार और शून्यता मानक: {statute}",
    "es": "Fundamento Legal y Criterio de Nulidad: {statute}",
    "de": "Gesetzliche Grundlage & Nichtigkeitsnorm: {statute}",
    "fr": "Fondement Légal & Critère de Nullité : {statute}",
    "ja": "根拠法令および無効化基準：{statute}",
    "zh": "法定依据与条款无效认定标准：{statute}"
},
  decoderSearchPlaceholder: {
    "en": "Search legal terms, Latin maxims, motions...",
    "hi": "कानूनी शर्तें, लैटिन कहावतें, याचिकाएं खोजें...",
    "es": "Buscar términos legales, máximas latinas, mociones...",
    "de": "Rechtsbegriffe, lateinische Maximen, Anträge suchen...",
    "fr": "Rechercher termes juridiques, maximes latines, requêtes...",
    "ja": "法律用語、ラテン語法格言、申立書を検索...",
    "zh": "搜索法律术语、拉丁法谚、诉讼动议..."
},
  decoderPronounce: {
    "en": "Pronounce",
    "hi": "उच्चारण",
    "es": "Pronunciar",
    "de": "Aussprache",
    "fr": "Prononcer",
    "ja": "音声発音",
    "zh": "朗读发音"
},
  decoderSpeaking: {
    "en": "Speaking...",
    "hi": "बोल रहा है...",
    "es": "Reproduciendo...",
    "de": "Spielt ab...",
    "fr": "Lecture en cours...",
    "ja": "再生中...",
    "zh": "正在朗读..."
},
  decoderCopy: {
    "en": "Copy",
    "hi": "कॉपी करें",
    "es": "Copiar",
    "de": "Kopieren",
    "fr": "Copier",
    "ja": "コピー",
    "zh": "复制"
},
  decoderCopied: {
    "en": "Copied",
    "hi": "कॉपी किया गया",
    "es": "Copiado",
    "de": "Kopiert",
    "fr": "Copié",
    "ja": "コピー完了",
    "zh": "已复制"
},
  decoderDefinition: {
    "en": "{category} DEFINITION",
    "hi": "{category} परिभाषा",
    "es": "DEFINICIÓN: {category}",
    "de": "{category}-DEFINITION",
    "fr": "DÉFINITION : {category}",
    "ja": "{category} 定義",
    "zh": "{category} 释义"
},
  decoderPlainEnglish: {
    "en": "Plain-English Translation",
    "hi": "सरल-अंग्रेजी अनुवाद",
    "es": "Traducción en Lenguaje Sencillo",
    "de": "Verständliche Übersetzung",
    "fr": "Traduction en Langage Clair",
    "ja": "平易な解説・日常語訳",
    "zh": "大白话通俗释义"
},
  decoderCourtContext: {
    "en": "How It Works In Court:",
    "hi": "अदालत में यह कैसे काम करता है:",
    "es": "Cómo Funciona en el Tribunal:",
    "de": "Praktische Wirkung vor Gericht:",
    "fr": "Fonctionnement au Tribunal :",
    "ja": "実際の法廷での機能・適用場面：",
    "zh": "法庭实务审理逻辑："
},
  decoderTacticalTip: {
    "en": "TACTICAL TIP FOR PRO SE LITIGANTS:",
    "hi": "स्व-प्रतिनिधित्व करने वाले वादियों के लिए सामरिक युक्ति:",
    "es": "CONSEJO TÁCTICO PARA LITIGANTES PRO SE:",
    "de": "TAKTIK-TIPP FÜR SELBSTVERTRETER (PRO SE):",
    "fr": "CONSEIL TACTIQUE POUR PLAIDEURS AUTONOMES :",
    "ja": "本人訴訟（プロセ）のための戦術的アドバイス：",
    "zh": "当事人本人诉讼实务攻防锦囊："
},
  decoderPracticalExample: {
    "en": "Practical Case Example:",
    "hi": "व्यावहारिक मामला उदाहरण:",
    "es": "Ejemplo Práctico de Caso:",
    "de": "Praxis-Fallbeispiel:",
    "fr": "Exemple Pratique de Cas :",
    "ja": "実務判例・訴訟での具体例：",
    "zh": "真实诉讼裁判实例如下："
},
  catAll: {
    "en": "all",
    "hi": "सभी",
    "es": "todos",
    "de": "alle",
    "fr": "tous",
    "ja": "すべて",
    "zh": "全部"
},
  catProcedural: {
    "en": "procedural",
    "hi": "प्रक्रियात्मक",
    "es": "procesal",
    "de": "verfahren",
    "fr": "procédure",
    "ja": "訴訟手続",
    "zh": "诉讼程序"
},
  catEvidence: {
    "en": "evidence",
    "hi": "साक्ष्य",
    "es": "pruebas",
    "de": "beweise",
    "fr": "preuves",
    "ja": "証拠",
    "zh": "证据规则"
},
  catContracts: {
    "en": "contracts",
    "hi": "अनुबंध",
    "es": "contratos",
    "de": "verträge",
    "fr": "contrats",
    "ja": "契約",
    "zh": "合同"
},
  catTorts: {
    "en": "torts",
    "hi": "अपकृत्य",
    "es": "daños civiles",
    "de": "delikte",
    "fr": "délits",
    "ja": "不法行為",
    "zh": "侵权"
},
  catLatin: {
    "en": "latin",
    "hi": "लैटिन",
    "es": "latín",
    "de": "latein",
    "fr": "latin",
    "ja": "ラテン語",
    "zh": "拉丁法谚"
},
  uplStatutoryCompliance: {
    "en": "MANDATORY STATUTORY COMPLIANCE • ABA MODEL RULE 5.5",
    "hi": "अनिवार्य वैधानिक अनुपालन • एबीए मॉडल नियम 5.5",
    "es": "CUMPLIMIENTO ESTATUTARIO OBLIGATORIO • REGLA MODELO 5.5 DE LA ABA",
    "de": "GESETZLICHE PFLICHTANGABE • ABA MUSTERREGEL 5.5",
    "fr": "CONFORMITÉ LÉGALE OBLIGATOIRE • RÈGLE MODÈLE ABA 5.5",
    "ja": "法定開示事項（義務） • 米国法曹協会（ABA）模範規則5.5準拠",
    "zh": "法定合规强制披露 • 美国律师协会 (ABA) 示范规则 5.5"
},
  uplNoticeTitle: {
    "en": "Unauthorized Practice of Law (UPL) Notice",
    "hi": "कानून के अनधिकृत अभ्यास (UPL) की सूचना",
    "es": "Aviso sobre Ejercicio No Autorizado de la Abogacía (UPL)",
    "de": "Hinweis zum Verbot unbefugter Rechtsberatung (UPL)",
    "fr": "Avis sur l’Exercice Illégal du Droit (UPL)",
    "ja": "非弁活動（弁護士資格外行為・UPL）防止に関する告知",
    "zh": "关于非律师从事法律业务 (UPL) 的合规声明"
},
  uplCloseNotice: {
    "en": "Close Notice",
    "hi": "सूचना बंद करें",
    "es": "Cerrar Aviso",
    "de": "Hinweis schließen",
    "fr": "Fermer l’Avis",
    "ja": "閉じる",
    "zh": "关闭声明"
},
  uplPlatformOnly: {
    "en": "LEGAL PREPARATION & EDUCATIONAL SELF-HELP PLATFORM ONLY",
    "hi": "केवल कानूनी तैयारी और शैक्षिक स्व-सहायता मंच",
    "es": "PLATAFORMA EXCLUSIVA DE PREPARACIÓN LEGAL Y AUTOAYUDA EDUCATIVA",
    "de": "REINE JURISTISCHE VORBEREITUNGS- & BILDUNGSPLATTFORM",
    "fr": "PLATEFORME DE PRÉPARATION JURIDIQUE ET D’AUTO-ASSISTANCE ÉDUCATIVE UNIQUEMENT",
    "ja": "訴訟準備・自己解決学習専用プラットフォーム",
    "zh": "仅供诉讼筹备、文书整理与普法教育自助使用"
},
  uplMainQuote: {
    "en": "\"SueChef is a legal preparation, document organization, and self-help educational platform. SueChef is NOT a law firm and its software does not provide legal advice or create an attorney-client relationship. Users represent themselves pro se or must retain licensed legal counsel.\"",
    "hi": "\"SueChef एक कानूनी तैयारी, दस्तावेज़ संगठन और स्व-सहायता शैक्षिक मंच है। SueChef कोई कानूनी फर्म नहीं है और इसका सॉफ़्टवेयर कानूनी सलाह प्रदान नहीं करता है या वकील-मुवक्किल संबंध नहीं बनाता है। उपयोगकर्ता अदालत में स्वयं का प्रतिनिधित्व करते हैं या उन्हें लाइसेंस प्राप्त वकील की सेवा लेनी चाहिए।\"",
    "es": "\"SueChef es una plataforma educativa de autoayuda, preparación legal y organización documental. SueChef NO es un bufete de abogados y su software no brinda asesoramiento legal ni crea una relación abogado-cliente. Los usuarios se representan a sí mismos pro se o deben contratar a un abogado colegiado.\"",
    "de": "\"SueChef ist eine Plattform zur Vorbereitung, Dokumentenorganisation und juristischen Weiterbildung. SueChef ist KEINE Anwaltskanzlei und bietet keine Rechtsberatung an noch begründet die Software ein Mandatsverhältnis. Nutzer vertreten sich selbst vor Gericht (pro se) oder müssen einen zugelassenen Anwalt beauftragen.\"",
    "fr": "\"SueChef est une plateforme éducative d’auto-assistance, de préparation juridique et d’organisation documentaire. SueChef N’EST PAS un cabinet d’avocats et ses outils ne fournissent aucun conseil juridique ni ne créent de relation avocat-client. Les utilisateurs agissent en personne (pro se) ou doivent engager un avocat agréé.\"",
    "ja": "「SueChefは法律紛争の事前準備、証拠整理、学習支援のための自己解決プラットフォームです。SueChefは法律事務所ではなく、法的助言（リーガルアドバイス）の提供や弁護士・依頼者関係の形成は行いません。利用者は本人訴訟（プロセ）として自ら手続きを行うか、資格を有する弁護士に依頼する必要があります。」",
    "zh": "“SueChef 是一个诉前准备、证据文书归档与普法教育自学工具。SueChef 并非律师事务所，本软件亦不提供正式法律意见或建立律师-客户代理关系。用户应以当事人本人身份 (pro se) 独立进行诉讼，或依法委托具备执业资质的执业律师。”"
},
  uplCard1Title: {
    "en": "1. Pro Se Self-Representation",
    "hi": "1. स्व-प्रतिनिधित्व (Pro Se)",
    "es": "1. Autorrepresentación Pro Se",
    "de": "1. Selbstvertretung vor Gericht (Pro Se)",
    "fr": "1. Auto-Représentation Pro Se",
    "ja": "1. 本人訴訟（プロセ自律解決）",
    "zh": "1. 当事人独立诉讼 (Pro Se)"
},
  uplCard1Body: {
    "en": "You are representing yourself in court as a self-represented pro se litigant. All templates, calculations, and pleading sheets are automated tools that require your own independent verification.",
    "hi": "आप अदालत में स्वयं का प्रतिनिधित्व कर रहे हैं। सभी टेम्पलेट, गणनाएं और दलील पत्र स्वचालित उपकरण हैं जिनके लिए आपके अपने स्वतंत्र सत्यापन की आवश्यकता होती है।",
    "es": "Usted se representa a sí mismo en el tribunal como litigante pro se. Todas las plantillas, cálculos y escritos son herramientas automatizadas que requieren su verificación independiente.",
    "de": "Sie vertreten sich vor Gericht eigenverantwortlich als Selbstvertreter. Alle Vorlagen, Berechnungen und Schriftsätze sind Hilfsmittel, die Ihrer eigenständigen Prüfung bedürfen.",
    "fr": "Vous vous représentez vous-même devant les tribunaux en tant que plaideur pro se. Tous les modèles, calculs et mémoires sont des outils automatisés exigeant votre vérification indépendante.",
    "ja": "利用者は法廷において自らを代理する本人訴訟当事者です。すべてのテンプレート、損害賠償計算、訴状様式は自動支援ツールであり、ご自身での確認が必須です。",
    "zh": "您作为当事人本人自行行使诉讼权利。所有诉状模板、利息计算与举证清单均为辅助工具，需由您独立核实并承担最终法律责任。"
},
  uplCard2Title: {
    "en": "2. Evidentiary Privilege Notice",
    "hi": "2. साक्ष्य विशेषाधिकार सूचना",
    "es": "2. Aviso de Privilegio Probatorio",
    "de": "2. Hinweis zum Anwaltsgeheimnis",
    "fr": "2. Secret Professionnel & Confidentialité",
    "ja": "2. 秘匿特権（守秘義務対象外）の注意",
    "zh": "2. 证据保密特权限制声明"
},
  uplCard2Body: {
    "en": "Information and documents entered into SueChef are not protected by attorney-client privilege until transmitted to a licensed attorney retained to represent you.",
    "hi": "SueChef में दर्ज की गई जानकारी और दस्तावेज़ वकील-मुवक्किल विशेषाधिकार द्वारा तब तक सुरक्षित नहीं हैं जब तक कि आपका प्रतिनिधित्व करने के लिए रखे गए लाइसेंस प्राप्त वकील को प्रेषित नहीं किए जाते।",
    "es": "La información y los documentos introducidos en SueChef no están protegidos por el secreto profesional ni privilegio abogado-cliente hasta que sean transmitidos a un abogado colegiado contratado.",
    "de": "In SueChef eingegebene Daten und Dokumente unterliegen nicht dem Anwaltsgeheimnis, solange sie nicht an einen beauftragten Rechtsanwalt übermittelt werden.",
    "fr": "Les informations et pièces saisies dans SueChef ne sont pas couvertes par le secret professionnel de l’avocat tant qu’elles ne sont pas transmises à votre avocat mandaté.",
    "ja": "SueChefに入力・保存された文書や情報は、委任契約を結んだ弁護士に送付されるまで、弁護士・依頼者間秘匿特権（Attorney-Client Privilege）の保護を受けません。",
    "zh": "在输入 SueChef 的信息与材料正式递交给受托执业律师之前，不受普通法上的“律师-客户保密特权”保护。"
},
  uplCard3Title: {
    "en": "3. 100% Offline Device Privacy",
    "hi": "3. 100% ऑफ़लाइन डिवाइस गोपनीयता",
    "es": "3. Privacidad 100% Local en el Dispositivo",
    "de": "3. 100% Lokaler Datenschutz auf dem Gerät",
    "fr": "3. Confidentialité 100% Locale sur l’Appareil",
    "ja": "3. 100%端末内ローカル完結プライバシー",
    "zh": "3. 100% 端侧本地隐私安全"
},
  uplCard3Body: {
    "en": "All cases, evidence SHA-256 hashes, and documents remain strictly on your local device. SueChef operates zero cloud collection servers and transmits no client legal records.",
    "hi": "सभी मामले, साक्ष्य SHA-256 हैश और दस्तावेज़ पूरी तरह से आपके स्थानीय डिवाइस पर रहते हैं। SueChef शून्य क्लाउड संग्रह सर्वर संचालित करता है।",
    "es": "Todos los casos, hashes SHA-256 de pruebas y documentos permanecen estrictamente en su dispositivo. SueChef no opera servidores de recopilación en la nube ni transmite expedientes.",
    "de": "Alle Streitfälle, SHA-256-Beweishashes und Akten verbleiben ausschließlich lokal auf Ihrem Gerät. SueChef betreibt keine Cloud-Datenspeicher.",
    "fr": "Tous les dossiers, empreintes SHA-256 des preuves et documents restent strictement stockés sur votre appareil. SueChef ne transmet aucun dossier à des serveurs cloud.",
    "ja": "すべての事件記録、SHA-256証拠ハッシュ、訴訟文書はお使いの端末内に厳格に暗号化保存されます。クラウド収集サーバーへの送信は一切行われません。",
    "zh": "所有案件记录、证据 SHA-256 哈希值与文书均完全保存在本地设备中。SueChef 不设任何云端收集服务器，绝不上传您的法律隐私。"
},
  uplCard4Title: {
    "en": "4. Statutory Bar Compliance",
    "hi": "4. वैधानिक बार अनुपालन",
    "es": "4. Cumplimiento Estatutario del Colegio de Abogados",
    "de": "4. Konformität mit Standesrichtlinien",
    "fr": "4. Conformité Déontologique des Barreaux",
    "ja": "4. 各国司法制度・バーアソシエーション準拠",
    "zh": "4. 律师协会与司法监管合规"
},
  uplCard4Body: {
    "en": "Complies with American Bar Association (ABA) Model Rule 5.5 and State Bar Pro Se Access to Justice Guidelines across all 50 U.S. states and international jurisdictions.",
    "hi": "सभी 50 अमेरिकी राज्यों और अंतर्राष्ट्रीय न्यायालयों में अमेरिकन बार एसोसिएशन (ABA) मॉडल नियम 5.5 और स्टेट बार प्रो से एक्सेस टू जस्टिस दिशानिर्देशों का अनुपालन करता है।",
    "es": "Cumple con la Regla Modelo 5.5 de la American Bar Association (ABA) y las Directrices de Acceso a la Justicia para Litigantes Pro Se en los 50 estados y jurisdicciones globales.",
    "de": "Erfüllt die Vorgaben der American Bar Association (ABA) Model Rule 5.5 sowie Leitlinien zum Rechtszugang für Selbstvertreter in allen 50 US-Bundesstaaten und international.",
    "fr": "Conforme à la règle modèle 5.5 de l’American Bar Association (ABA) et aux directives d’accès à la justice des justiciables pro se dans les 50 États américains et à l’international.",
    "ja": "全米50州および国際管轄区における米国法曹協会（ABA）模範規則5.5および本人訴訟司法アクセス指針に完全準拠しています。",
    "zh": "严格符合美国律师协会 (ABA) 示范规则 5.5 及全美 50 州与全球各主要司法辖区关于公民司法救济途径的法定自律规范。"
},
  uplCheckbox1: {
    "en": "I acknowledge and agree: SueChef is not a law firm, does not provide legal advice, does not guarantee litigation outcomes, and I assume sole responsibility for all court filings.",
    "hi": "मैं स्वीकार करता हूं और सहमत हूं: SueChef कोई कानून फर्म नहीं है, कानूनी सलाह प्रदान नहीं करता है, मुकदमों के परिणामों की गारंटी नहीं देता है, और मैं सभी अदालती दाखिलों की पूरी जिम्मेदारी लेता हूं।",
    "es": "Reconozco y acepto: SueChef no es un bufete de abogados, no brinda asesoría legal, no garantiza resultados judiciales y asumo la responsabilidad exclusiva de todas las presentaciones judiciales.",
    "de": "Ich bestätige und willige ein: SueChef ist keine Anwaltskanzlei, bietet keine Rechtsberatung, garantiert keine Prozessergebnisse und ich übernehme die alleinige Verantwortung für alle Schriftsätze.",
    "fr": "Je reconnais et accepte : SueChef n’est pas un cabinet d’avocats, ne dispense aucun conseil juridique, ne garantit aucune issue judiciaire et j’assume l’entière responsabilité de mes dépôts d’actes.",
    "ja": "【確認・同意事項】SueChefは法律事務所ではなく、法的助言を行わず、裁判の結果を保証するものではないことを理解し、法廷への提出文書に関する全責任を自身で負うことに同意します。",
    "zh": "【确认并同意】本人明确知悉：SueChef 并非律师事务所，不提供法律意见，不保证案件胜诉结果，本人对递交法庭的所有文书与诉讼行为承担全部法律责任。"
},
  uplCheckbox2: {
    "en": "I understand the Evidentiary Privilege Limitation: Information stored locally in SueChef is not covered by attorney-client privilege until retained counsel receives it.",
    "hi": "मैं साक्ष्य विशेषाधिकार सीमा को समझता हूं: SueChef में स्थानीय रूप से संग्रहीत जानकारी वकील-मुवक्किल विशेषाधिकार के अंतर्गत तब तक नहीं आती जब तक कि वकील इसे प्राप्त नहीं कर लेता।",
    "es": "Comprendo la Limitación del Privilegio Probatorio: La información guardada localmente en SueChef no está amparada por el secreto profesional hasta que un abogado contratado la reciba.",
    "de": "Ich verstehe die Beschränkung des Anwaltsgeheimnisses: Lokal in SueChef gespeicherte Informationen genießen erst dann Vertraulichkeitsschutz, wenn ein beauftragter Anwalt sie erhält.",
    "fr": "Je comprends la limitation du secret professionnel : Les données stockées localement dans SueChef ne bénéficient de la confidentialité avocat-client qu’une fois remises à un avocat désigné.",
    "ja": "【秘匿特権の制限】SueChef端末内に保存された情報は、正式に委任した弁護士に受領されるまで弁護士・依頼者間秘匿特権の保護を受けないことを理解しました。",
    "zh": "【保密特权范围声明】本人明确知晓：在本地设备中存储的信息，在正式递交受托律师之前，不享有律师-客户代理保密特权。"
},
  uplTermsProtocol: {
    "en": "Terms of Use & Pro Se Self-Help Protocol v1.0.0",
    "hi": "उपयोग की शर्तें और प्रो से स्व-सहायता प्रोटोकॉल v1.0.0",
    "es": "Condiciones de Uso y Protocolo de Autoayuda Pro Se v1.0.0",
    "de": "Nutzungsbedingungen & Selbsthilfe-Protokoll v1.0.0",
    "fr": "Conditions d’Utilisation & Protocole d’Auto-Assistance v1.0.0",
    "ja": "利用規約および本人訴訟自律支援プロトコル v1.0.0",
    "zh": "使用条款与当事人本人诉讼自律规范协议 v1.0.0"
},
  uplAcceptButton: {
    "en": "Accept Terms & Enter Workstation",
    "hi": "शर्तें स्वीकार करें और वर्कस्टेशन में प्रवेश करें",
    "es": "Aceptar Términos y Entrar a la Estación",
    "de": "Bedingungen akzeptieren & Arbeitsbereich betreten",
    "fr": "Accepter les Conditions & Accéder à la Station",
    "ja": "規約に同意してワークステーションを開始",
    "zh": "接受条款并进入诉讼工作台"
},
  pricingHeaderBadge: {
    "en": "COMMERCIAL EDITIONS & LICENSING",
    "hi": "वाणिज्यिक संस्करण एवं लाइसेंसिंग",
    "es": "EDICIONES COMERCIALES Y LICENCIAS",
    "de": "KOMMERZIELLE VERSIONEN & LIZENZEN",
    "fr": "ÉDITIONS COMMERCIALES ET LICENCES",
    "ja": "コマーシャル版＆ライセンス",
    "zh": "商业版本与正版授权"
},
  pricingHeaderTitle: {
    "en": "SueChef Professional Litigation Tiers",
    "hi": "SueChef व्यावसायिक मुकदमेबाजी स्तर",
    "es": "Niveles Profesionales de Litigio SueChef",
    "de": "SueChef Professionelle Streitfall-Tarife",
    "fr": "Niveaux de Litige Professionnels SueChef",
    "ja": "SueChef プロフェッショナル訴訟スイート",
    "zh": "SueChef 专业民商事诉讼支持级别"
},
  pricingClose: {
    "en": "Close Pricing",
    "hi": "मूल्य निर्धारण बंद करें",
    "es": "Cerrar Precios",
    "de": "Preise schließen",
    "fr": "Fermer les Tarifs",
    "ja": "料金表を閉じる",
    "zh": "关闭价格表"
},
  pricingSubtitle: {
    "en": "Fair, Transparent Pricing for Pro Se Litigants & Businesses",
    "hi": "वादियों और व्यवसायों के लिए निष्पक्ष, पारदर्शी मूल्य निर्धारण",
    "es": "Precios Claros y Transparentes para Litigantes Pro Se y Empresas",
    "de": "Faire, transparente Preise für Selbstvertreter & Unternehmen",
    "fr": "Tarifs Équitables et Transparents pour Justiciables et Entreprises",
    "ja": "本人訴訟当事者および事業者のための明朗会計プラン",
    "zh": "为当事人与中小微企业提供清晰、透明的公道定价"
},
  pricingSubdesc: {
    "en": "100% offline-ready. Keep all work locally encrypted on your device. No hidden recurring lock-ins.",
    "hi": "100% ऑफ़लाइन तैयार। सभी कार्यों को अपने डिवाइस पर स्थानीय रूप से एन्क्रिप्ट रखें। कोई छिपा हुआ शुल्क नहीं।",
    "es": "100% sin conexión. Conserve su trabajo encriptado localmente en su dispositivo. Sin suscripciones forzadas.",
    "de": "100% offline-fähig. Alle Daten bleiben lokal verschlüsselt auf Ihrem Gerät. Keine Abo-Fallen.",
    "fr": "100% hors ligne. Conservez vos dossiers chiffrés localement sur votre appareil. Aucun abonnement caché.",
    "ja": "100%オフライン対応。すべての事件記録は端末内で暗号化保持。不要な自動課金はありません。",
    "zh": "100% 离线可用。数据在本地设备上全面加密保存。无任何隐藏自动续费陷阱。"
},
  pricingFreeTitle: {
    "en": "Free Tier",
    "hi": "निःशुल्क स्तर",
    "es": "Nivel Gratuito",
    "de": "Kostenlose Stufe",
    "fr": "Version Gratuite",
    "ja": "フリープラン",
    "zh": "免费基础版"
},
  pricingFreePrice: {
    "en": "$0",
    "hi": "₹0",
    "es": "0 €",
    "de": "0 €",
    "fr": "0 €",
    "ja": "0円",
    "zh": "¥0"
},
  pricingFreeSub: {
    "en": "Always Free / Educational",
    "hi": "हमेशा मुफ़्त / शैक्षिक",
    "es": "Siempre Gratis / Educativo",
    "de": "Dauerhaft kostenlos / Bildung",
    "fr": "Toujours Gratuit / Éducatif",
    "ja": "完全無料・学習向け",
    "zh": "永久免费 / 普法教育"
},
  pricingFreeF1: {
    "en": "Legalese decoder & legal dictionary",
    "hi": "कानूनी डिकोडर और कानूनी शब्दकोश",
    "es": "Decodificador de jerga y diccionario legal",
    "de": "Juristischer Übersetzer & Rechtslexikon",
    "fr": "Décodeur juridique & dictionnaire de droit",
    "ja": "法律用語翻訳＆法学辞書機能",
    "zh": "法言法语通俗解析与法律名词词典"
},
  pricingFreeF2: {
    "en": "Basic civil dispute checklist",
    "hi": "बुनियादी नागरिक विवाद चेकलिस्ट",
    "es": "Lista de verificación básica de litigios civiles",
    "de": "Basis-Checkliste für Zivilstreitigkeiten",
    "fr": "Check-list de litige civil de base",
    "ja": "基本民事紛争チェックリスト",
    "zh": "基础民事纠纷要件事实核对表"
},
  pricingFreeF3: {
    "en": "50-State small claims statutory limits",
    "hi": "50 राज्यों की छोटी दावों की वैधानिक सीमाएं",
    "es": "Límites estatutarios de cuantía menor en los 50 estados",
    "de": "Gesetzliche Streitwertgrenzen für Bagatellklagen (50 Staaten)",
    "fr": "Plafonds légaux des petites créances des 50 États",
    "ja": "全米50州少額訴訟の管轄上限額早見表",
    "zh": "全美 50 州小额法庭法定起诉标的限额速查"
},
  pricingFreeF4: {
    "en": "Basic fee waiver guidance",
    "hi": "बुनियादी शुल्क माफी मार्गदर्शन",
    "es": "Orientación básica para exención de tasas judiciales",
    "de": "Leitfaden für Prozesskostenhilfe / Gerichtskostenbefreiung",
    "fr": "Guide d’aide juridictionnelle & exonération de frais",
    "ja": "訴訟費用免除申請の基本ガイド",
    "zh": "诉讼费缓减免申请实用指引"
},
  pricingFreeSelect: {
    "en": "Select Free",
    "hi": "निःशुल्क चुनें",
    "es": "Elegir Gratis",
    "de": "Kostenlos wählen",
    "fr": "Choisir Gratuit",
    "ja": "無料プランを選択",
    "zh": "选择免费版"
},
  pricingFreeCurrent: {
    "en": "Current Tier",
    "hi": "वर्तमान स्तर",
    "es": "Nivel Actual",
    "de": "Aktiver Tarif",
    "fr": "Niveau Actuel",
    "ja": "現在のプラン",
    "zh": "当前所用级别"
},
  pricingProPopular: {
    "en": "Most Popular for Court",
    "hi": "अदालत के लिए सबसे लोकप्रिय",
    "es": "Más Popular para Tribunales",
    "de": "Am beliebtesten vor Gericht",
    "fr": "Le Plus Populaire au Tribunal",
    "ja": "法廷対策で最も選ばれています",
    "zh": "诉讼开庭实战首选"
},
  pricingProTitle: {
    "en": "Pro Litigant",
    "hi": "प्रो वादी",
    "es": "Litigante Pro",
    "de": "Prozess-Profi (Pro Litigant)",
    "fr": "Plaideur Professionnel",
    "ja": "プロ訴訟エディション",
    "zh": "诉讼攻防专业版"
},
  pricingProPrice: {
    "en": "$49",
    "hi": "₹3,999",
    "es": "49 €",
    "de": "49 €",
    "fr": "49 €",
    "ja": "6,800円",
    "zh": "¥349"
},
  pricingProPriceUnit: {
    "en": "/case or $19.99/mo",
    "hi": "/मामला या ₹1,599/माह",
    "es": "/caso o 19,99 €/mes",
    "de": "/Fall oder 19,99 €/Monat",
    "fr": "/dossier ou 19,99 €/mois",
    "ja": "/件 または 2,800円/月",
    "zh": "/案 或 ¥139/月"
},
  pricingProSub: {
    "en": "Complete Legal Court Arsenal",
    "hi": "पूर्ण कानूनी अदालत शस्त्रागार",
    "es": "Arsenal Completo para Litigios Judiciales",
    "de": "Vollständiges juristisches Prozessarsenal",
    "fr": "Arsenal Judiciaire Complet",
    "ja": "充実した法廷訴訟ツール一式",
    "zh": "法庭决战全套武器库"
},
  pricingProF1: {
    "en": "Full 28-Line Pleading Generator (California & Federal format)",
    "hi": "पूर्ण 28-पंक्ति याचिका जनरेटर (कैलिफोर्निया और संघीय प्रारूप)",
    "es": "Generador de Escritos de 28 Líneas (formato California y Federal)",
    "de": "28-Zeilen-Schriftsatzgenerator (Kalifornien & Bundesformat)",
    "fr": "Générateur d’actes 28 lignes (formats Californie et Fédéral)",
    "ja": "28行形式公式訴状ジェネレーター（カリフォルニア・連邦裁判所準拠）",
    "zh": "标准 28 行起诉状生成器 (加州及联邦双格式)"
},
  pricingProF2: {
    "en": "Formal Demand Letters with pre-judgment statutory interest",
    "hi": "पूर्व-निर्णय वैधानिक ब्याज के साथ औपचारिक मांग पत्र",
    "es": "Cartas de Reclamación Formal con intereses previos al fallo",
    "de": "Mahn- & Aufforderungsschreiben mit Verzugszinsenberechnung",
    "fr": "Mises en demeure formelles avec intérêts moratoires légaux",
    "ja": "判決前法定利息計算付き正式催告書（内容証明対応）作成",
    "zh": "包含判决前法定利息计算的标准律师催告函"
},
  pricingProF3: {
    "en": "SHA-256 Evidence Hashing & FRE 901 chain-of-custody stamping",
    "hi": "SHA-256 साक्ष्य हैशिंग और FRE 901 साक्ष्य श्रृंखला मुद्रांकन",
    "es": "Hashing SHA-256 de pruebas y sellado de cadena de custodia FRE 901",
    "de": "SHA-256-Beweishashes & FRE 901-Kettensicherung",
    "fr": "Scellement SHA-256 des preuves & conformité chaîne de garde FRE 901",
    "ja": "SHA-256証拠ハッシュ生成＆連邦証拠規則901管理連続性スタンプ",
    "zh": "SHA-256 证据防篡改哈希核验与 FRE 901 证据保管链存证"
},
  pricingProF4: {
    "en": "Master Attorney Dossier export & print",
    "hi": "मास्टर अटॉर्नी डोजियर निर्यात और प्रिंट",
    "es": "Exportación e impresión del Dossier del Abogado Contrario",
    "de": "Export & Druck des Anwaltsdossiers",
    "fr": "Exportation et impression du dossier d’avocat",
    "ja": "相手方代理人弁護士プロファイルのエクスポート＆印刷",
    "zh": "对方代理律师背景策略档案导出与打印"
},
  pricingProF5: {
    "en": "Interactive Mock Hearing objection simulator",
    "hi": "इंटरैक्टिव मॉक सुनवाई आपत्ति सिम्युलेटर",
    "es": "Simulador interactivo de objeciones para juicio simulado",
    "de": "Interaktiver Verhandlungssimulator für Einwände",
    "fr": "Simulateur interactif d’objections pour audience fictive",
    "ja": "法廷異議申し立て（Objection）模擬シミュレーター",
    "zh": "法庭举证质证与程序异议模拟对抗实训"
},
  pricingProSelect: {
    "en": "Activate Pro Litigant",
    "hi": "प्रो वादी सक्रिय करें",
    "es": "Activar Litigante Pro",
    "de": "Prozess-Profi aktivieren",
    "fr": "Activer Plaideur Pro",
    "ja": "プロプランを有効化",
    "zh": "激活专业版权限"
},
  pricingProCurrent: {
    "en": "✓ Pro Tier Active",
    "hi": "✓ प्रो स्तर सक्रिय है",
    "es": "✓ Nivel Pro Activo",
    "de": "✓ Pro-Tarif aktiv",
    "fr": "✓ Niveau Pro Actif",
    "ja": "✓ プロプラン適用中",
    "zh": "✓ 专业版已激活"
},
  pricingBizTitle: {
    "en": "Business / Landlord",
    "hi": "व्यवसाय / मकान मालिक",
    "es": "Empresas y Propietarios",
    "de": "Unternehmen / Vermieter",
    "fr": "Entreprises / Bailleurs",
    "ja": "法人・不動産オーナー版",
    "zh": "企业主与商户定制版"
},
  pricingBizPrice: {
    "en": "$99 – $199",
    "hi": "₹7,999 – ₹15,999",
    "es": "99 € – 199 €",
    "de": "99 € – 199 €",
    "fr": "99 € – 199 €",
    "ja": "14,800円 – 29,800円",
    "zh": "¥699 – ¥1,399"
},
  pricingBizPriceUnit: {
    "en": "/yr",
    "hi": "/वर्ष",
    "es": "/año",
    "de": "/Jahr",
    "fr": "/an",
    "ja": "/年",
    "zh": "/年"
},
  pricingBizSub: {
    "en": "Multi-Case Organization",
    "hi": "बहु-मामला संगठन",
    "es": "Gestión Multicaso Empresarial",
    "de": "Organisation mehrerer Streitfälle",
    "fr": "Gestion Multi-Dossiers Entreprise",
    "ja": "複数事件一括管理",
    "zh": "多纠纷批量化并案管理"
},
  pricingBizF1: {
    "en": "Unlimited Multi-Case Dashboard",
    "hi": "असीमित बहु-मामला डैशबोर्ड",
    "es": "Panel Multicaso Ilimitado",
    "de": "Unbegrenztes Dashboard für mehrere Fälle",
    "fr": "Tableau de bord multi-dossiers illimité",
    "ja": "無制限マルチケース管理ダッシュボード",
    "zh": "无限制多案件统一监管仪表板"
},
  pricingBizF2: {
    "en": "Security deposit recovery & accounting",
    "hi": "सुरक्षा जमा वसूली और लेखांकन",
    "es": "Contabilidad y recuperación de depósitos de garantía",
    "de": "Kautionsabrechnung & Kautionsrückforderung",
    "fr": "Comptabilité et recouvrement des dépôts de garantie",
    "ja": "敷金・保証金返還精算および明細管理",
    "zh": "房屋押金与租赁保证金核算追偿"
},
  pricingBizF3: {
    "en": "Unpaid invoice & contractor demand tracking",
    "hi": "अवैतनिक चालान और ठेकेदार मांग ट्रैकिंग",
    "es": "Seguimiento de facturas impagadas y demandas a contratistas",
    "de": "Forderungsmanagement für unbezahlte Rechnungen",
    "fr": "Suivi des factures impayées et litiges prestataires",
    "ja": "未払い請求書・請負業者債権回収トラッキング",
    "zh": "应收账款逾期催收与工程欠款追索"
},
  pricingBizF4: {
    "en": "Certified mail tracking log & USPS skip tracing",
    "hi": "प्रमाणित मेल ट्रैकिंग लॉग और डाक सेवा स्किप ट्रेसिंग",
    "es": "Registro de correo certificado y localización postal",
    "de": "Einschreiben-Verfolgungsprotokoll & Nachforschungen",
    "fr": "Registre de suivi des courriers recommandés",
    "ja": "配達証明郵便（書留）追跡ログ＆送達調査",
    "zh": "特快专递挂号信溯源追踪与地址排查"
},
  pricingBizF5: {
    "en": "Zero-Knowledge AES-GCM Encrypted Vault backups",
    "hi": "शून्य-ज्ञान AES-GCM एन्क्रिप्टेड वॉल्ट बैकअप",
    "es": "Copias de seguridad en bóveda encriptada AES-GCM de conocimiento cero",
    "de": "Zero-Knowledge AES-GCM verschlüsselte Tresor-Backups",
    "fr": "Sauvegardes chiffrées AES-GCM à connaissance nulle",
    "ja": "ゼロ知識証明AES-GCM暗号化保管庫バックアップ",
    "zh": "零知识 AES-GCM 本地加密保险箱档案备份"
},
  pricingBizSelect: {
    "en": "Select Business Tier",
    "hi": "व्यवसाय स्तर चुनें",
    "es": "Elegir Nivel Empresarial",
    "de": "Business-Tarif wählen",
    "fr": "Sélectionner l’Offre Entreprise",
    "ja": "ビジネスプランを選択",
    "zh": "选定企业商户版"
},
  pricingBizCurrent: {
    "en": "✓ Business Active",
    "hi": "✓ व्यवसाय सक्रिय है",
    "es": "✓ Plan Empresarial Activo",
    "de": "✓ Business aktiv",
    "fr": "✓ Offre Entreprise Active",
    "ja": "✓ ビジネスプラン適用中",
    "zh": "✓ 企业商户版已激活"
},
  pricingActiveCase: {
    "en": "Active Case: {caseTitle}",
    "hi": "सक्रिय मामला: {caseTitle}",
    "es": "Caso Activo: {caseTitle}",
    "de": "Aktiver Fall: {caseTitle}",
    "fr": "Dossier Actif : {caseTitle}",
    "ja": "選択中の事件：{caseTitle}",
    "zh": "当前正在处理的纠纷：{caseTitle}"
},
  pricingDone: {
    "en": "Done",
    "hi": "संपन्न",
    "es": "Listo",
    "de": "Fertig",
    "fr": "Terminé",
    "ja": "完了",
    "zh": "完成"
},
  claimKitchenTitle: {
    "en": "The Claim Kitchen",
    "hi": "द क्लेम किचन",
    "es": "La Cocina de Demandas (Claim Kitchen)",
    "de": "Die Klage-Küche (Claim Kitchen)",
    "fr": "La Cuisine des Réclamations",
    "ja": "クレーム・キッチン（請求要件ラボ）",
    "zh": "诉求厨房 (Claim Kitchen)"
},
  claimKitchenSubtitle: {
    "en": "Dispute Strength Evaluator, Plain-English Legal Requirements & Damages Calculator",
    "hi": "विवाद शक्ति मूल्यांकनकर्ता, सरल कानूनी आवश्यकताएं और क्षति कैलकुलेटर",
    "es": "Evaluador de Solidez de Demandas, Requisitos Legales y Calculadora de Daños",
    "de": "Klageerfolgs-Prüfung, verständliche Anspruchsvoraussetzungen & Schadensrechner",
    "fr": "Évaluation de la Solidité du Litige, Exigences Légales & Calculateur de Préjudices",
    "ja": "勝訴可能性判定、法律要件の平易解説、および損害賠償計算機",
    "zh": "诉讼胜诉力评估、大白话实体法定要件与法定赔偿金计算器"
},
  meritStrengthScore: {
    "en": "Merit Strength Score",
    "hi": "योग्यता शक्ति स्कोर",
    "es": "Puntuación de Solidez Jurídica",
    "de": "Erfolgsaussichts-Score",
    "fr": "Score de Solidité Juridique",
    "ja": "勝訴見込みスコア",
    "zh": "诉求成立胜算评估分"
},
  // Common / Brand
  appName: {
    en: 'SueChef',
    hi: 'SueChef',
    es: 'SueChef',
    de: 'SueChef',
    fr: 'SueChef',
    ja: 'SueChef',
    zh: 'SueChef'
  },
  appTagline: {
    en: 'Civil Dispute Preparation & Legal Second Opinion',
    hi: 'नागरिक विवाद की तैयारी और कानूनी द्वितीय राय',
    es: 'Preparación de Litigios Civiles y Segunda Opinión Legal',
    de: 'Zivilstreit-Vorbereitung & Juristische Zweitmeinung',
    fr: 'Préparation aux Litiges Civils et Deuxième Avis Juridique',
    ja: '民事紛争準備・法的セカンドオピニオン支援',
    zh: '民事纠纷诉前准备与法律第二意见评估'
  },
  civilDisputeSuite: {
    en: 'CIVIL DISPUTE SUITE',
    hi: 'दीवानी विवाद समाधान सूट',
    es: 'SUITE DE LITIGIOS CIVILES',
    de: 'ZIVILRECHTLICHE DISPUT-SUITE',
    fr: 'SUITE DE RÈGLEMENT DES LITIGES CIVILS',
    ja: '民事紛争解決スイート',
    zh: '民事纠纷诉讼支持套件'
  },
  encryptedLocal: {
    en: 'ENCRYPTED & LOCAL',
    hi: 'एन्क्रिप्टेड और स्थानीय रूप से सुरक्षित',
    es: 'ENCRIPTADO Y LOCAL',
    de: 'VERSCHLÜSSELT & LOKAL',
    fr: 'CHIFFRÉ ET LOCAL',
    ja: '暗号化・ローカル保護',
    zh: '本地加密与隐私保护'
  },

  // Two-tier legal clauses
  whatThisMeansForYou: {
    en: 'What this means for you',
    hi: 'आपके लिए इसका क्या अर्थ है',
    es: 'Qué significa esto para usted',
    de: 'Was das für Sie bedeutet',
    fr: 'Ce que cela signifie pour vous',
    ja: 'あなたにとっての意味（平易な解説）',
    zh: '这对您意味着什么（通俗解读）'
  },
  officialLegalTerms: {
    en: 'Official Legal Terms & Citations',
    hi: 'आधिकारिक कानूनी शर्तें और उद्धरण',
    es: 'Términos Legales Oficiales y Citas',
    de: 'Offizielle Rechtstexte & Paragraphen',
    fr: 'Termes Juridiques Officiels & Textes de Loi',
    ja: '公的法令・条文および判例の引用',
    zh: '官方法律条款与法典引用'
  },
  readFullClause: {
    en: 'Read Full Clause',
    hi: 'पूरा कानूनी खंड पढ़ें',
    es: 'Leer Cláusula Completa',
    de: 'Vollständige Klausel lesen',
    fr: 'Lire la Clause Complète',
    ja: '全文を読む（法令条項）',
    zh: '阅读完整法律条款'
  },
  hideLegalTerms: {
    en: 'Hide Legal Terms',
    hi: 'कानूनी शर्तें छिपाएं',
    es: 'Ocultar Términos Legales',
    de: 'Rechtstext ausblenden',
    fr: 'Masquer les Termes Juridiques',
    ja: '条文を閉じる',
    zh: '收起法律条款'
  },
  keyLiabilitiesDeadlines: {
    en: 'Key Liabilities & Statutory Deadlines',
    hi: 'प्रमुख देनदारियां और समय सीमाएं',
    es: 'Obligaciones Clave y Plazos Estatutarios',
    de: 'Hauptverbindlichkeiten & Gesetzliche Fristen',
    fr: 'Obligations Clés & Délais Légaux',
    ja: '主な責任・法定提出期限',
    zh: '核心法律责任与法定截止时限'
  },
  rightsAndRecoveries: {
    en: 'Rights & Potential Recoveries',
    hi: 'आपके अधिकार और संभावित वसूली',
    es: 'Derechos y Compensaciones Posibles',
    de: 'Ihre Rechte & Mögliche Entschädigungen',
    fr: 'Vos Droits & Indemnisations Potentielles',
    ja: 'あなたの権利および賠償請求権',
    zh: '您的合法权益与可主张赔偿'
  },
  statutoryPenalties: {
    en: 'Statutory Penalties & Liabilities',
    hi: 'वैधानिक दंड और दायित्व',
    es: 'Sanciones Estatutarias y Responsabilidades',
    de: 'Gesetzliche Strafen & Haftung',
    fr: 'Pénalités Légales & Responsabilités',
    ja: '法定損害賠償・ペナルティ',
    zh: '法定惩罚性赔偿与责任'
  },
  plainLanguageSummary: {
    en: 'Plain-Language Summary',
    hi: 'सरल भाषा में सारांश',
    es: 'Resumen en Lenguaje Sencillo',
    de: 'Verständliche Zusammenfassung',
    fr: 'Résumé en Langage Clair',
    ja: '平易な言語による要約',
    zh: '通俗易懂的简述'
  },
  statutoryCitation: {
    en: 'Governing Statute',
    hi: 'शासी कानून',
    es: 'Estatuto Legal Aplicable',
    de: 'Maßgeblicher Paragraph',
    fr: 'Texte de Loi Applicable',
    ja: '根拠条文・準拠法',
    zh: '适用法律条文'
  },
  copyCitation: {
    en: 'Copy Citation',
    hi: 'उद्धरण कॉपी करें',
    es: 'Copiar Cita',
    de: 'Zitat kopieren',
    fr: 'Copier la Référence',
    ja: '条文引用をコピー',
    zh: '复制法条引用'
  },
  citationCopied: {
    en: 'Citation Copied!',
    hi: 'उद्धरण कॉपी हो गया!',
    es: '¡Cita Copiada!',
    de: 'Zitat kopiert!',
    fr: 'Référence Copiée !',
    ja: '引用をコピーしました！',
    zh: '法条已成功复制！'
  },
  viewFullText: {
    en: 'View Full Text',
    hi: 'पूरा पाठ देखें',
    es: 'Ver Texto Completo',
    de: 'Volltext ansehen',
    fr: 'Voir le Texte Intégral',
    ja: '全文を表示',
    zh: '查看完整条文'
  },

  // Case Status & Pipeline
  caseStatus: {
    en: 'Dispute Status',
    hi: 'विवाद की स्थिति',
    es: 'Estado del Litigio',
    de: 'Verfahrensstatus',
    fr: 'Statut du Litige',
    ja: '紛争の進行状況',
    zh: '案件所处阶段'
  },
  activeDispute: {
    en: 'Active Pro Se Dispute',
    hi: 'सक्रिय स्वयं-प्रतिनिधित्व विवाद',
    es: 'Disputa Pro Se Activa',
    de: 'Aktiver Rechtsstreit',
    fr: 'Litige Pro Se Actif',
    ja: '進行中の本人訴訟・紛争',
    zh: '正在进行的诉讼/争议'
  },
  claimsAssembled: {
    en: 'Claims Assembled & Ready',
    hi: 'दावे तैयार और संगठित',
    es: 'Reclamaciones Listas y Ensambladas',
    de: 'Ansprüche fertiggestellt',
    fr: 'Dossier Prêt & Structuré',
    ja: '請求要件の整理完了',
    zh: '请求权基础已理清'
  },
  preFilingDemand: {
    en: 'Pre-Litigation Demand Stage',
    hi: 'मुकदमा पूर्व मांग पत्र चरण',
    es: 'Etapa de Reclamación Previa',
    de: 'Vorgerichtliche Mahnphase',
    fr: 'Phase de Mise en Demeure',
    ja: '提訴前の内容証明・請求書送付段階',
    zh: '诉前催告函与交涉阶段'
  },
  inCourtLitigation: {
    en: 'Formal In-Court Litigation',
    hi: 'न्यायालयीन कार्यवाही चरण',
    es: 'Litigio Judicial Formal',
    de: 'Gerichtsverfahrensphase',
    fr: 'Procédure Judiciaire en Cours',
    ja: '裁判所における訴訟段階',
    zh: '正式法院诉讼阶段'
  },
  nextImmediateAction: {
    en: 'Immediate Next Action',
    hi: 'तत्काल अगला कदम',
    es: 'Acción Inmediata Siguiente',
    de: 'Nächster Handlungsschritt',
    fr: 'Prochaine Action Immédiate',
    ja: '次に取るべき具体的なアクション',
    zh: '下一步紧急操作'
  },
  opposingPartyCounsel: {
    en: 'Opposing Party / Counsel',
    hi: 'विरोधी पक्ष / वकील',
    es: 'Parte Contraria / Abogado',
    de: 'Gegenseite / Anwalt',
    fr: 'Partie Adverse / Avocat',
    ja: '相手方当事者 / 代理人弁護士',
    zh: '对方当事人 / 代理律师'
  },
  filingDeadlineSol: {
    en: 'Filing Deadlines & SOL',
    hi: 'दाखिल करने की समय सीमा और परिसीमा',
    es: 'Plazos de Presentación y Prescripción',
    de: 'Klagefristen & Verjährung',
    fr: 'Délais de Prescription & Dépôt',
    ja: '提訴期限および消滅時効',
    zh: '诉讼时效与起诉截止日期'
  },
  statuteOfLimitations: {
    en: 'Statute of Limitations',
    hi: 'परिसीमा अधिनियम (SOL)',
    es: 'Prescripción (SOL)',
    de: 'Verjährung (SOL)',
    fr: 'Prescription Légale (SOL)',
    ja: '消滅時効（SOL）',
    zh: '法定诉讼时效 (SOL)'
  },
  daysRemaining: {
    en: 'days remaining',
    hi: 'दिन शेष',
    es: 'días restantes',
    de: 'Tage verbleibend',
    fr: 'jours restants',
    ja: '日残り',
    zh: '天剩余'
  },
  stepTracker: {
    en: 'Litigation Step Tracker',
    hi: 'मुकदमेबाजी चरण ट्रैकर',
    es: 'Seguimiento de Fases del Litigio',
    de: 'Verfahrensfortschritt',
    fr: 'Suivi des Étapes du Litige',
    ja: '紛争解決ステップトラッカー',
    zh: '诉讼全流程进度追踪'
  },
  step1BuildCase: {
    en: '1. Build Case',
    hi: '1. मामला बनाएं',
    es: '1. Armar Caso',
    de: '1. Fall aufbauen',
    fr: '1. Monter le Dossier',
    ja: '1. 主張の構築',
    zh: '1. 确立诉求'
  },
  step2Evidence: {
    en: '2. Evidence',
    hi: '2. साक्ष्य व प्रमाण',
    es: '2. Pruebas',
    de: '2. Beweise',
    fr: '2. Preuves',
    ja: '2. 証拠の整理',
    zh: '2. 梳理证据'
  },
  step3Demand: {
    en: '3. Demand',
    hi: '3. मांग पत्र',
    es: '3. Requerimiento',
    de: '3. Mahnschreiben',
    fr: '3. Mise en Demeure',
    ja: '3. 催告書・請求',
    zh: '3. 催告交涉'
  },
  step4CourtPapers: {
    en: '4. Court Papers',
    hi: '4. अदालती दस्तावेज',
    es: '4. Escritos Judiciales',
    de: '4. Schriftsätze',
    fr: '4. Actes de Procédure',
    ja: '4. 訴状・裁判書面',
    zh: '4. 起诉书状'
  },
  step5SettleEnforce: {
    en: '5. Settle & Enforce',
    hi: '5. समझौता व प्रवर्तन',
    es: '5. Negociar y Ejecutar',
    de: '5. Vergleich & Vollstreckung',
    fr: '5. Négocier & Exécuter',
    ja: '5. 和解・強制執行',
    zh: '5. 和解与执行'
  },

  // Navigation Items
  navHome: {
    en: 'Home',
    hi: 'होम',
    es: 'Inicio',
    de: 'Startseite',
    fr: 'Accueil',
    ja: 'ホーム',
    zh: '首页'
  },
  navBuildCase: {
    en: 'Build Case',
    hi: 'मामला बनाएं',
    es: 'Armar Caso',
    de: 'Fall aufbauen',
    fr: 'Monter le Dossier',
    ja: '主張の構築',
    zh: '确立诉求'
  },
  navEvidence: {
    en: 'Evidence & Proof',
    hi: 'साक्ष्य और प्रमाण',
    es: 'Pruebas y Evidencia',
    de: 'Beweise & Belege',
    fr: 'Preuves & Pièces',
    ja: '証拠と立証',
    zh: '证据整理'
  },
  navCourtPapers: {
    en: 'Court Papers',
    hi: 'अदालती दस्तावेज',
    es: 'Escritos Judiciales',
    de: 'Gerichtsschriftsätze',
    fr: 'Actes de Procédure',
    ja: '裁判書面',
    zh: '诉讼文书'
  },
  navDemandSettle: {
    en: 'Demand & Settle',
    hi: 'मांग और समझौता',
    es: 'Requerir y Pactar',
    de: 'Mahnung & Vergleich',
    fr: 'Mise en Demeure & Accord',
    ja: '催告と和解交渉',
    zh: '索赔与和解'
  },
  navCaseStrategy: {
    en: 'Case Strategy',
    hi: 'केस रणनीति',
    es: 'Estrategia',
    de: 'Strategie',
    fr: 'Stratégie',
    ja: '勝訴戦略',
    zh: '案件策略'
  },
  navLegalAid: {
    en: 'Legal Aid & Courts',
    hi: 'कानूनी सहायता व अदालत',
    es: 'Asistencia y Cortes',
    de: 'Prozesskostenhilfe & Gerichte',
    fr: 'Aide Juridictionnelle & Tribunaux',
    ja: '法テラス・裁判所',
    zh: '法律援助与法院'
  },
  navRequestEvidence: {
    en: 'Request Evidence',
    hi: 'साक्ष्य मांगें',
    es: 'Solicitar Pruebas',
    de: 'Beweisanträge',
    fr: 'Demandes de Pièces',
    ja: '証拠開示請求',
    zh: '申请证据调查'
  },
  navTrialPrep: {
    en: 'Trial Prep',
    hi: 'सुनवाई तैयारी',
    es: 'Preparar Juicio',
    de: 'Verhandlungstraining',
    fr: 'Préparation d’Audience',
    ja: '弁論・口頭審理準備',
    zh: '庭审准备'
  },
  navSolDocket: {
    en: 'SOL Docket',
    hi: 'समय सीमा (SOL)',
    es: 'Plazos Legales',
    de: 'Fristen-Kalender',
    fr: 'Registre des Délais',
    ja: '時効・期日管理',
    zh: '诉讼时效日历'
  },
  navServiceProof: {
    en: 'Service & Proof',
    hi: 'तामील और प्रमाण',
    es: 'Notificación y Fe',
    de: 'Zustellung & Nachweis',
    fr: 'Signification & Preuve',
    ja: '送達・証明',
    zh: '送达与凭据'
  },
  navLegalDecoder: {
    en: 'Legal Decoder',
    hi: 'कानूनी डिकोडर',
    es: 'Decodificador Legal',
    de: 'Juristischer Übersetzer',
    fr: 'Décodeur Juridique',
    ja: '法律用語の翻訳',
    zh: '法言法语通俗译'
  },
  navAttorneyBinder: {
    en: 'Attorney Binder',
    hi: 'वकील डॉसियर',
    es: 'Carpeta de Abogado',
    de: 'Anwaltsdossier',
    fr: 'Dossier d’Avocat',
    ja: '相手方・弁護士情報',
    zh: '对方律师画像'
  },
  navSecurityVault: {
    en: 'Security Vault',
    hi: 'सुरक्षा वॉल्ट',
    es: 'Bóveda de Seguridad',
    de: 'Sicherheits-Tresor',
    fr: 'Coffre de Sécurité',
    ja: '暗号化保管庫',
    zh: '安全保险箱'
  },
  navMore: {
    en: 'More',
    hi: 'अधिक',
    es: 'Más',
    de: 'Mehr',
    fr: 'Plus',
    ja: '詳細',
    zh: '更多'
  },

  // Common Buttons & Labels
  btnAskAiAdvisor: {
    en: 'Ask AI Legal Advisor',
    hi: 'AI कानूनी सलाहकार से पूछें',
    es: 'Consultar Asesor Legal IA',
    de: 'KI-Rechtsberater befragen',
    fr: 'Consulter l’Avocat IA',
    ja: 'AI法律顧問に質問する',
    zh: '咨询 AI 法律顾问'
  },
  btnConsultAdvisor: {
    en: 'Consult Advisor',
    hi: 'परामर्श लें',
    es: 'Consultar Asesor',
    de: 'Berater fragen',
    fr: 'Consulter',
    ja: '相談する',
    zh: '咨询顾问'
  },
  btnInstantAssessment: {
    en: 'Instant Dispute Assessment',
    hi: 'तुरंत विवाद मूल्यांकन',
    es: 'Evaluación Instantánea del Caso',
    de: 'Sofortige Ersteinschätzung',
    fr: 'Évaluation Immédiate du Litige',
    ja: '即時紛争診断',
    zh: '一键案件可行性评估'
  },
  btnStartHere: {
    en: 'Start Here',
    hi: 'यहाँ से शुरू करें',
    es: 'Comenzar Aquí',
    de: 'Hier beginnen',
    fr: 'Commencer Ici',
    ja: 'ここから開始',
    zh: '从此开始'
  },
  btnEditParties: {
    en: 'Edit Parties',
    hi: 'पक्षकारों का नाम बदलें',
    es: 'Editar Partes',
    de: 'Parteien bearbeiten',
    fr: 'Modifier les Parties',
    ja: '当事者名を編集',
    zh: '修改当事人名称'
  },
  btnSwitchDispute: {
    en: 'Switch / New Dispute',
    hi: 'विवाद बदलें / नया मामला',
    es: 'Cambiar / Nueva Disputa',
    de: 'Fall wechseln / Neu',
    fr: 'Changer / Nouveau Litige',
    ja: '事件の切替 / 新規',
    zh: '切换 / 新建案件'
  },
  btnGuidedTour: {
    en: 'Guided Tour',
    hi: 'मार्गदर्शित दौरा',
    es: 'Tour Guiado',
    de: 'Geführte Tour',
    fr: 'Visite Guidée',
    ja: 'ガイドツアー',
    zh: '引导演示'
  },
  btnSettings: {
    en: 'Settings',
    hi: 'सेटिंग्स',
    es: 'Ajustes',
    de: 'Einstellungen',
    fr: 'Paramètres',
    ja: '設定',
    zh: '系统设置'
  },
  btnCommercialTiers: {
    en: 'Pro Tiers',
    hi: 'प्रो प्लान',
    es: 'Planes Pro',
    de: 'Pro-Tarife',
    fr: 'Offres Pro',
    ja: 'プロ版プラン',
    zh: '专业版方案'
  },
  btnSearch: {
    en: 'Search',
    hi: 'खोजें',
    es: 'Buscar',
    de: 'Suchen',
    fr: 'Rechercher',
    ja: '検索',
    zh: '全案搜索'
  },
  btnBack: {
    en: 'Back',
    hi: 'वापस',
    es: 'Volver',
    de: 'Zurück',
    fr: 'Retour',
    ja: '戻る',
    zh: '返回'
  },
  btnSaveNotes: {
    en: 'Save Notes',
    hi: 'नोट्स सहेजें',
    es: 'Guardar Notas',
    de: 'Notizen speichern',
    fr: 'Enregistrer les Notes',
    ja: 'メモを保存',
    zh: '保存证据说明'
  },
  btnCancel: {
    en: 'Cancel',
    hi: 'रद्द करें',
    es: 'Cancelar',
    de: 'Abbrechen',
    fr: 'Annuler',
    ja: 'キャンセル',
    zh: '取消'
  },
  btnTapToEdit: {
    en: 'Tap to Edit',
    hi: 'संपादित करने के लिए टैप करें',
    es: 'Tocar para Editar',
    de: 'Tippen zum Bearbeiten',
    fr: 'Appuyer pour Modifier',
    ja: 'タップして編集',
    zh: '点击直接编辑'
  },
  btnClickToEdit: {
    en: 'Click to edit',
    hi: 'संपादित करने के लिए क्लिक करें',
    es: 'Clic para editar',
    de: 'Klicken zum Bearbeiten',
    fr: 'Cliquer pour modifier',
    ja: 'クリックして編集',
    zh: '点击直接修改'
  },
  btnVerified: {
    en: 'Verified',
    hi: 'सत्यापित',
    es: 'Verificado',
    de: 'Bestätigt',
    fr: 'Vérifié',
    ja: '認証済み',
    zh: '已核实'
  },
  btnAddElement: {
    en: '+ Element',
    hi: '+ तत्व जोड़ें',
    es: '+ Elemento',
    de: '+ Merkmal',
    fr: '+ Élément',
    ja: '+ 要件を追加',
    zh: '+ 构成要件'
  },
  btnReloadStandards: {
    en: 'Reload Standards',
    hi: 'मानक पुनः लोड करें',
    es: 'Recargar Estándares',
    de: 'Standards neu laden',
    fr: 'Recharger les Critères',
    ja: '標準要件を再読込',
    zh: '重载法定要件'
  },
  btnCopyMemo: {
    en: 'Copy Advice Memo',
    hi: 'सलाह मेमो कॉपी करें',
    es: 'Copiar Memorando',
    de: 'Gutachten kopieren',
    fr: 'Copier le Mémorandum',
    ja: '意見書をコピー',
    zh: '复制咨询备忘录'
  },
  btnPrintBrief: {
    en: 'Print Brief',
    hi: 'संक्षेप प्रिंट करें',
    es: 'Imprimir Escrito',
    de: 'Schriftsatz drucken',
    fr: 'Imprimer le Mémoire',
    ja: '書面を印刷',
    zh: '打印案件摘要'
  },

  // Merit & Metric Badges
  meritRating: {
    en: 'Merit Rating',
    hi: 'मामले की योग्यता',
    es: 'Calificación de Mérito',
    de: 'Erfolgsaussicht-Note',
    fr: 'Note de Solidité',
    ja: '勝訴性評価',
    zh: '胜诉优势评级'
  },
  winProbability: {
    en: 'Win Probability',
    hi: 'जीतने की संभावना',
    es: 'Probabilidad de Ganar',
    de: 'Gewinnwahrscheinlichkeit',
    fr: 'Probabilité de Gain',
    ja: '勝訴確率',
    zh: '预估胜诉概率'
  },
  damagesClaimed: {
    en: 'Damages Claimed',
    hi: 'मांगा गया हर्जाना',
    es: 'Daños Reclamados',
    de: 'Geltend gemachter Schaden',
    fr: 'Dommages Réclamés',
    ja: '請求損害額',
    zh: '主张索赔金额'
  },
  legalFeesSaved: {
    en: 'Est. Legal Fees Saved',
    hi: 'बचत की गई अनुमानित फीस',
    es: 'Honorarios Ahorrados Est.',
    de: 'Geschätzte Anwaltskostenersparnis',
    fr: 'Économie d’Honoraires Estimée',
    ja: '節約された推定弁護士費用',
    zh: '预估节约律师费'
  },
  plainEnglishGuide: {
    en: 'Plain English Guide',
    hi: 'सरल मार्गदर्शिका',
    es: 'Guía en Lenguaje Claro',
    de: 'Leitfaden in Klartext',
    fr: 'Guide en Clair',
    ja: 'わかりやすい解説',
    zh: '通俗法律指引'
  },
  exhibitAdmissible: {
    en: 'Court Admissible — FRE 901',
    hi: 'अदालत में स्वीकार्य — FRE 901',
    es: 'Admisible en Corte — FRE 901',
    de: 'Gerichtlich zulässig — FRE 901',
    fr: 'Recevable au Tribunal — FRE 901',
    ja: '法廷提出適格 — FRE 901',
    zh: '庭审证据有效采纳 — FRE 901'
  },
  exhibitCertified: {
    en: 'EXHIBIT CERTIFIED',
    hi: 'प्रदर्श प्रमाणित',
    es: 'PRUEBA CERTIFICADA',
    de: 'BEWEISSTÜCK ZERTIFIZIERT',
    fr: 'PIÈCE CERTIFIÉE',
    ja: '証拠認定済み',
    zh: '证据已认证'
  },
  elementProven: {
    en: 'Proven',
    hi: 'प्रमाणित',
    es: 'Probado',
    de: 'Nachgewiesen',
    fr: 'Prouvé',
    ja: '立証完了',
    zh: '已充分证明'
  },
  elementUnproven: {
    en: 'Pending Proof',
    hi: 'प्रमाण प्रतीक्षित',
    es: 'Pendiente de Prueba',
    de: 'Ausstehend',
    fr: 'En Attente de Preuve',
    ja: '立証準備中',
    zh: '待补充证据'
  },
  samplePlaceholder: {
    en: 'Sample Placeholder',
    hi: 'नमूना प्लेसहोल्डर',
    es: 'Ejemplo de Muestra',
    de: 'Beispiel-Platzhalter',
    fr: 'Exemple Modèle',
    ja: 'サンプルの雛形',
    zh: '范例占位符'
  },
  exampleClickToReplace: {
    en: 'Tap to edit with your facts',
    hi: 'अपने वास्तविक विवरण लिखने के लिए टैप करें',
    es: 'Tocar para editar con sus hechos reales',
    de: 'Tippen, um mit Ihren echten Daten auszufüllen',
    fr: 'Appuyez pour personnaliser avec vos faits',
    ja: 'タップしてあなたの事実関係を入力',
    zh: '点击直接替换为您自己的事实细节'
  },
  selectLanguage: {
    en: 'Display Language',
    hi: 'भाषा चुनें',
    es: 'Idioma de la Aplicación',
    de: 'Anzeigesprache',
    fr: 'Langue d’Affichage',
    ja: '表示言語の選択',
    zh: '界面显示语言'
  },
  languageSubtitle: {
    en: 'Select your preferred language for the interface and legal guides',
    hi: 'इंटरफ़ेस और कानूनी गाइड के लिए अपनी पसंदीदा भाषा चुनें',
    es: 'Seleccione su idioma preferido para la interfaz y guías legales',
    de: 'Wählen Sie Ihre bevorzugte Sprache für Oberfläche und Rechtsratgeber',
    fr: 'Choisissez votre langue préférée pour l’interface et les guides juridiques',
    ja: '画面表示および法律解説ガイドの言語を選択してください',
    zh: '选择您最习惯的语言查看系统界面与法律解读'
  },

  // Workstation Drawer Items
  drawerTitle: {
    en: 'All Litigation Workstations',
    hi: 'सभी मुकदमेबाजी कार्यक्षेत्र',
    es: 'Todas las Estaciones de Litigio',
    de: 'Alle Rechtsstreit-Arbeitsbereiche',
    fr: 'Tous les Postes de Travail Juridiques',
    ja: 'すべての訴訟ワークステーション',
    zh: '全部诉讼支持工作台'
  },
  drawerSubtitle: {
    en: 'SueChef Everyday Legal Dispute Toolbox',
    hi: 'SueChef दैनिक कानूनी विवाद टूलबॉक्स',
    es: 'Caja de Herramientas Legales SueChef',
    de: 'SueChef Werkzeugkasten für Alltagsstreitigkeiten',
    fr: 'Boîte à Outils pour Litiges du Quotidien SueChef',
    ja: 'SueChef 日常生活の法律紛争ツールボックス',
    zh: 'SueChef 民事纠纷解决实用工具箱'
  },
  drawerEditParties: {
    en: 'Edit Case Parties',
    hi: 'पक्षकारों का नाम बदलें',
    es: 'Editar Partes del Caso',
    de: 'Parteien bearbeiten',
    fr: 'Modifier les Parties',
    ja: '当事者を編集',
    zh: '编辑案件当事人'
  },
  drawerTour: {
    en: 'Tour',
    hi: 'टूर',
    es: 'Tour',
    de: 'Tour',
    fr: 'Visite',
    ja: 'ツアー',
    zh: '导览'
  },
  drawerSettings: {
    en: 'Settings',
    hi: 'सेटिंग्स',
    es: 'Ajustes',
    de: 'Einstellungen',
    fr: 'Paramètres',
    ja: '設定',
    zh: '设置'
  },
  drawerMasterCharter: {
    en: 'Alumungandr Master Charter © 2026',
    hi: 'Alumungandr मास्टर चार्टर © 2026',
    es: 'Carta Magistral Alumungandr © 2026',
    de: 'Alumungandr Master-Charta © 2026',
    fr: 'Charte Maîtresse Alumungandr © 2026',
    ja: 'Alumungandr マスター憲章 © 2026',
    zh: 'Alumungandr 主规约 © 2026'
  },
  drawerClientPrivacy: {
    en: '100% Client-Side Privacy • Zero Cloud Upload',
    hi: '100% क्लाइंट-साइड गोपनीयता • शून्य क्लाउड अपलोड',
    es: '100% Privacidad en el Dispositivo • Sin Nube',
    de: '100% Lokaler Datenschutz • Kein Cloud-Upload',
    fr: '100% Confidentialité Locale • Zéro Téléversement',
    ja: '100% 端末内プライバシー保護 • クラウド送信なし',
    zh: '100% 本地端隐私保护 • 零数据云端上传'
  },
  drawerVerifiedLocal: {
    en: 'VERIFIED LOCAL',
    hi: 'सत्यापित स्थानीय',
    es: 'LOCAL VERIFICADO',
    de: 'LOKAL VERIFIZIERT',
    fr: 'LOCAL VÉRIFIÉ',
    ja: 'ローカル検証済',
    zh: '已验证本地'
  },

  // 10 Workstations
  wsEnforcementTitle: {
    en: 'Judgment & Collections',
    hi: 'निर्णय और वसूली',
    es: 'Sentencia y Cobranzas',
    de: 'Urteil & Vollstreckung',
    fr: 'Jugement & Recouvrement',
    ja: '判決と強制執行',
    zh: '判决与执行清收'
  },
  wsEnforcementDesc: {
    en: 'Writs, bank levies, wage garnishments & liens',
    hi: 'वारंट, बैंक लेवी, वेतन कटौती और ग्रहणाधिकार',
    es: 'Mandamientos, embargos bancarios, retenciones salariales y gravámenes',
    de: 'Pfändungsbeschlüsse, Kontopfändungen, Lohnpfändungen & Grundschulden',
    fr: 'Saisies bancaires, saisies sur salaires et hypothèques judiciaires',
    ja: '差押命令、銀行口座差押、給与差押、不動産先取特権',
    zh: '执行令、银行账户冻结划扣、薪资扣押与留置权'
  },
  wsEnforcementBadge: {
    en: 'Crucial',
    hi: 'महत्वपूर्ण',
    es: 'Crucial',
    de: 'Wichtig',
    fr: 'Crucial',
    ja: '重要',
    zh: '关键'
  },
  wsSettlementTitle: {
    en: 'Demand & Settle',
    hi: 'मांग और समझौता',
    es: 'Requerir y Pactar',
    de: 'Mahnung & Vergleich',
    fr: 'Mise en Demeure & Accord',
    ja: '催告と和解交渉',
    zh: '索赔与和解'
  },
  wsSettlementDesc: {
    en: 'Rule 408 negotiation brackets & offers',
    hi: 'नियम 408 बातचीत कोष्ठक और प्रस्ताव',
    es: 'Corchetes de negociación y ofertas bajo Regla 408',
    de: 'Verhandlungsspannen & Angebote nach Regel 408',
    fr: 'Fourchettes de négociation et offres confidentielles Règle 408',
    ja: '証拠不採用特権（Rule 408）に基づく和解交渉幅と提示額',
    zh: '基于免责保密规则（Rule 408）的谈判区间与和解要约'
  },
  wsLegalAidTitle: {
    en: 'Free Legal Aid & Courts',
    hi: 'निःशुल्क कानूनी सहायता व अदालत',
    es: 'Asistencia Legal Gratuita y Cortes',
    de: 'Kostenlose Rechtshilfe & Gerichte',
    fr: 'Aide Juridique Gratuite & Tribunaux',
    ja: '無料法律扶助（法テラス）・裁判所',
    zh: '免费法律援助与法院指引'
  },
  wsLegalAidDesc: {
    en: '131+ pro bono clinics & self-help portals',
    hi: '131+ निःशुल्क कानूनी क्लीनिक और स्वयं सहायता पोर्टल',
    es: 'Más de 131 clínicas pro bono y portales de autoayuda',
    de: 'Über 131 Pro-Bono-Kliniken & Selbsthilfe-Portale',
    fr: 'Plus de 131 cliniques gratuites et portails d’aide aux justiciables',
    ja: '131以上のプロボノ無料法律相談窓口および裁判所ポータル',
    zh: '131+ 法律援助机构、公益法律诊所与诉讼自助手册'
  },
  wsLegalAidBadge: {
    en: 'Verified',
    hi: 'सत्यापित',
    es: 'Verificado',
    de: 'Bestätigt',
    fr: 'Vérifié',
    ja: '認証済',
    zh: '官方核实'
  },
  wsDiscoveryTitle: {
    en: 'Request Evidence',
    hi: 'साक्ष्य की मांग करें',
    es: 'Solicitar Pruebas',
    de: 'Beweisanträge',
    fr: 'Demandes de Pièces',
    ja: '証拠開示請求',
    zh: '申请证据调查'
  },
  wsDiscoveryDesc: {
    en: 'Formal discovery interrogatories & document demands',
    hi: 'औपचारिक पूछताछ और दस्तावेज की मांग',
    es: 'Interrogatorios formales y requerimientos de documentos',
    de: 'Formelle Beweisanträge & Dokumentenanforderungen',
    fr: 'Interrogatoires formels et demandes de production de pièces',
    ja: '正式な質問状・文書提出命令申立書の作成',
    zh: '正式书面质询、文件调取请求与传票草拟'
  },
  wsTrialPrepTitle: {
    en: 'Court Hearing Prep',
    hi: 'अदालती सुनवाई की तैयारी',
    es: 'Preparar Audiencia Judicial',
    de: 'Gerichtsverhandlungstraining',
    fr: 'Préparation d’Audience',
    ja: '弁論・口頭審理準備',
    zh: '法庭庭审演练'
  },
  wsTrialPrepDesc: {
    en: 'Practice mock trial & evidentiary objections',
    hi: 'मॉक ट्रायल और साक्ष्य आपत्तियों का अभ्यास करें',
    es: 'Práctica de juicio simulado y objeciones probatorias',
    de: 'Musterverhandlung üben & Beweiseinwände trainieren',
    fr: 'Simulateur de procès et objections sur les pièces',
    ja: '模擬裁判の練習および証拠異議申し立ての訓練',
    zh: '模拟庭审问答、证据异议演练与发言提词'
  },
  wsSolWatcherTitle: {
    en: 'Statute of Limitations',
    hi: 'परिसीमा अधिनियम (SOL)',
    es: 'Prescripción de Acciones',
    de: 'Verjährungsfristen',
    fr: 'Prescription Légale',
    ja: '消滅時効・出訴期限',
    zh: '法定诉讼时效日历'
  },
  wsSolWatcherDesc: {
    en: 'Filing deadlines docket & tolling dates',
    hi: 'दाखिल करने की समय सीमा और स्थगन तिथियां',
    es: 'Calendario de plazos de presentación y fechas de interrupción',
    de: 'Klagefristen-Docket & Hemmungstatbestände',
    fr: 'Calendrier des délais d’action et dates d’interruption',
    ja: '提訴期限の期日表および時効完成猶予・更新管理',
    zh: '起诉截止日期追踪与时效中止/中断计算器'
  },
  wsServiceTrackerTitle: {
    en: 'Service of Process',
    hi: 'तामील और सम्मन',
    es: 'Notificación Judicial',
    de: 'Zustellung & Nachweis',
    fr: 'Signification d’Huissier',
    ja: '送達・証明',
    zh: '司法送达与送达证明'
  },
  wsServiceTrackerDesc: {
    en: 'Affidavits of service & summons tracking',
    hi: 'तामील का हलफनामा और सम्मन ट्रैकिंग',
    es: 'Declaraciones juradas de notificación y seguimiento de citaciones',
    de: 'Zustellungsurkunden & Ladungsverfolgung',
    fr: 'Attestations de signification et suivi des assignations',
    ja: '送達証明書・呼出状の送達状況追跡',
    zh: '送达宣誓证明书与传票送达全程追踪'
  },
  wsLegaleseDecoderTitle: {
    en: 'Plain-English Decoder',
    hi: 'सरल भाषा अनुवादक',
    es: 'Decodificador en Lenguaje Claro',
    de: 'Klartext-Übersetzer',
    fr: 'Décodeur en Langage Clair',
    ja: '法律用語の平易解説',
    zh: '法言法语通俗白话译'
  },
  wsLegaleseDecoderDesc: {
    en: 'Translate dense legal jargon into plain facts',
    hi: 'कठिन कानूनी भाषा को सरल तथ्यों में अनुवाद करें',
    es: 'Traduzca la jerga jurídica densa a hechos claros y comprensibles',
    de: 'Übersetzen Sie Juristendeutsch in einfache Fakten',
    fr: 'Traduisez le jargon juridique obscur en faits limpides',
    ja: '難解な法律用語や判例を分かりやすい事実に変換',
    zh: '将晦涩难懂的法律黑话一键翻译为大白话'
  },
  wsAttorneyDossierTitle: {
    en: 'Opposing Counsel',
    hi: 'विरोधी वकील',
    es: 'Abogado Contrario',
    de: 'Gegnerischer Anwalt',
    fr: 'Avocat Adverse',
    ja: '相手方代理人弁護士',
    zh: '对方代理律师画像'
  },
  wsAttorneyDossierDesc: {
    en: 'Opponent settlement patterns & strategies',
    hi: 'विरोधी के समझौते के तरीके और रणनीतियां',
    es: 'Patrones de acuerdo y estrategias del oponente',
    de: 'Vergleichsmuster & Taktiken der Gegenseite analysieren',
    fr: 'Historique des négociations et stratégies de l’adversaire',
    ja: '相手方の過去の和解傾向および訴訟戦術の分析',
    zh: '对方律师历史和解倾向、诉讼风格与应对策略'
  },
  wsSecurityVaultTitle: {
    en: 'Privacy & Offline Vault',
    hi: 'गोपनीयता और ऑफलाइन वॉल्ट',
    es: 'Privacidad y Bóveda Offline',
    de: 'Datenschutz & Offline-Tresor',
    fr: 'Confidentialité & Coffre Hors-Ligne',
    ja: 'プライバシーとオフライン保管庫',
    zh: '隐私保护与离线保险箱'
  },
  wsSecurityVaultDesc: {
    en: 'Local encryption & tamper-evident export',
    hi: 'स्थानीय एन्क्रिप्शन और छेड़छाड़-प्रूफ निर्यात',
    es: 'Cifrado local y exportación con sello inviolable',
    de: 'Lokale Verschlüsselung & manipulationssicherer Export',
    fr: 'Chiffrement local et export infalsifiable',
    ja: '端末内ローカル暗号化および改ざん防止エクスポート',
    zh: '端到端本地强加密与防篡改案件归档导出'
  },

  // Evidentiary Equilibrium (ChambersScalesAnimation)
  scaleTitle: {
    en: 'Burden of Proof & Evidentiary Equilibrium',
    hi: 'सबूत का भार और साक्ष्य संतुलन',
    es: 'Carga de la Prueba y Equilibrio Probatorio',
    de: 'Beweislast & Beweisgleichgewicht',
    fr: 'Charge de la Preuve & Équilibre Probatoire',
    ja: '立証責任および証拠の均衡天秤',
    zh: '举证责任与证据优势平衡天平'
  },
  scaleStandard: {
    en: 'Civil legal standard: 51%+ preponderance of credible evidence establishes claim viability',
    hi: 'दीवानी कानूनी मानक: 51%+ विश्वसनीय साक्ष्य की प्रधानता दावे की व्यवहार्यता स्थापित करती है',
    es: 'Estándar legal civil: 51%+ preponderancia de evidencia creíble establece viabilidad del reclamo',
    de: 'Zivilrechtlicher Standard: Über 51% Beweisüberhang begründet den Anspruch',
    fr: 'Standard civil : 51%+ de prépondérance de la preuve établit la validité de la demande',
    ja: '民事訴訟の立証基準：51%以上の証拠の優越（高度の蓋然性）により請求が認容されます',
    zh: '民事诉讼法定证明标准：51%以上优势证据（盖然性占优）即可支持诉讼请求成立'
  },
  scalePreponderanceMet: {
    en: '⚖️ Preponderance Met ({percent}%)',
    hi: '⚖️ साक्ष्य का पलड़ा भारी ({percent}%)',
    es: '⚖️ Preponderancia Cumplida ({percent}%)',
    de: '⚖️ Beweislast erfüllt ({percent}%)',
    fr: '⚖️ Prépondérance Atteinte ({percent}%)',
    ja: '⚖️ 証拠の優越を達成 ({percent}%)',
    zh: '⚖️ 优势证据标准已达成 ({percent}%)'
  },
  scaleTieEquilibrium: {
    en: '⚖️ Tie Equilibrium (50%)',
    hi: '⚖️ बराबर संतुलन (50%)',
    es: '⚖️ Empate Probatorio (50%)',
    de: '⚖️ Gleichstand (50%)',
    fr: '⚖️ Équilibre Parfait (50%)',
    ja: '⚖️ 証拠五分五分の均衡 (50%)',
    zh: '⚖️ 双方证据势均力敌 (50%)'
  },
  scaleRebuttalNeeded: {
    en: '⚠️ Rebuttal Needed ({percent}%)',
    hi: '⚠️ खंडन की आवश्यकता ({percent}%)',
    es: '⚠️ Refutación Necesaria ({percent}%)',
    de: '⚠️ Gegenbeweis erforderlich ({percent}%)',
    fr: '⚠️ Réfutation Nécessaire ({percent}%)',
    ja: '⚠️ 反証・追加証拠が必要 ({percent}%)',
    zh: '⚠️ 需补充证据进行有力反驳 ({percent}%)'
  },
  scaleEvidenceDetails: {
    en: 'Evidence Details',
    hi: 'साक्ष्य विवरण',
    es: 'Detalles de Pruebas',
    de: 'Beweisdetails',
    fr: 'Détails des Preuves',
    ja: '証拠の詳細',
    zh: '证据明细'
  },
  scaleResetSim: {
    en: 'Reset Simulation to Real Case Baseline',
    hi: 'सिमुलेशन को वास्तविक मामले पर रीसेट करें',
    es: 'Restablecer Simulación a Línea Base Real',
    de: 'Simulation auf Basisfall zurücksetzen',
    fr: 'Réinitialiser la Simulation au Cas Réel',
    ja: 'シミュレーションを実際の基準値に戻す',
    zh: '将模拟天平重置为当前案件基准'
  },
  scaleExpand: {
    en: 'Expand Scale Animation',
    hi: 'स्केल एनीमेशन बढ़ाएं',
    es: 'Expandir Animación de Balanza',
    de: 'Waagen-Animation erweitern',
    fr: 'Agrandir l’Animation de Balance',
    ja: '天秤アニメーションを展開',
    zh: '展开天平动画'
  },
  scaleCollapse: {
    en: 'Collapse Scale',
    hi: 'स्केल छोटा करें',
    es: 'Contraer Balanza',
    de: 'Waage minimieren',
    fr: 'Réduire la Balance',
    ja: '天秤を折りたたむ',
    zh: '收起天平'
  },
  scalePlaintiffExhibits: {
    en: 'Plaintiff: {count} Exhibits & Proofs',
    hi: 'वादी: {count} प्रदर्श और प्रमाण',
    es: 'Demandante: {count} Pruebas y Evidencias',
    de: 'Kläger: {count} Beweisstücke & Belege',
    fr: 'Demandeur : {count} Pièces & Justificatifs',
    ja: '原告側: {count} 点の提出書証・立証資料',
    zh: '原告主张：{count} 项实物证据与证明要件'
  },
  scaleDefenseWarnings: {
    en: 'Defense: {count} Defect Warnings',
    hi: 'बचाव: {count} आपत्ति चेतावनियां',
    es: 'Defensa: {count} Advertencias de Defecto',
    de: 'Beklagter: {count} Einwand-Warnungen',
    fr: 'Défense : {count} Objections Prévues',
    ja: '被告側: {count} 件の抗弁・欠陥警告',
    zh: '被告抗辩：{count} 处诉求漏洞与防守抗辩'
  },
  scaleShowAnimated: {
    en: 'Show Animated Scales',
    hi: 'एनिमेटेड स्केल दिखाएं',
    es: 'Mostrar Balanza Animada',
    de: 'Animierte Waage anzeigen',
    fr: 'Afficher la Balance Animée',
    ja: '動的な天秤を表示',
    zh: '显示动态正义天平'
  },
  scaleProofLabel: {
    en: 'Proof:',
    hi: 'सबूत:',
    es: 'Prueba:',
    de: 'Beweis:',
    fr: 'Preuve :',
    ja: '原告立証:',
    zh: '原告举证:'
  },
  scaleDefenseLabel: {
    en: 'Defense:',
    hi: 'बचाव:',
    es: 'Defensa:',
    de: 'Verteidigung:',
    fr: 'Défense :',
    ja: '被告抗弁:',
    zh: '被告抗辩:'
  },
  scaleCivilAdvantage: {
    en: '{percent}% Civil Scale Advantage',
    hi: '{percent}% नागरिक स्केल बढ़त',
    es: '{percent}% Ventaja en Balanza Civil',
    de: '{percent}% Zivilrechtlicher Vorteil',
    fr: '{percent}% d’Avantage sur la Balance Civile',
    ja: '{percent}% の民事立証優勢',
    zh: '{percent}% 民事举证优势度'
  },
  scaleAdvantageDiff: {
    en: '+{diff} advantage over defense',
    hi: 'बचाव पर +{diff} की बढ़त',
    es: '+{diff} ventaja sobre la defensa',
    de: '+{diff} Vorteil gegenüber der Gegenseite',
    fr: '+{diff} d’avantage sur la défense',
    ja: '相手方に対し +{diff} ポイントの優勢',
    zh: '相比被告抗辩具备 +{diff} 点领先优势'
  },
  scaleDeadlock: {
    en: 'Exact 50/50 deadlock',
    hi: 'बिल्कुल 50/50 गतिरोध',
    es: 'Punto muerto exacto 50/50',
    de: 'Exakter 50/50-Gleichstand',
    fr: 'Égalité parfaite 50/50',
    ja: '50/50 の完全な膠着状態',
    zh: '双方各占 50% 均势胶着'
  },
  scaleDeficit: {
    en: '{diff} deficit',
    hi: '{diff} की कमी',
    es: '{diff} déficit probatorio',
    de: '{diff} Rückstand',
    fr: '{diff} de déficit probatoire',
    ja: '{diff} の立証不足',
    zh: '存在 {diff} 点证明力劣势'
  },
  scaleReset: {
    en: 'Reset',
    hi: 'रीसेट',
    es: 'Restablecer',
    de: 'Zurücksetzen',
    fr: 'Réinitialiser',
    ja: 'リセット',
    zh: '重置'
  },
  scalePlainEnglishRuleTitle: {
    en: 'Plain English Rule:',
    hi: 'सरल नियम:',
    es: 'Regla en Lenguaje Sencillo:',
    de: 'Verständliche Regel:',
    fr: 'Règle en Clair :',
    ja: '平易なルール解説:',
    zh: '通俗法律铁律:'
  },
  scalePlainEnglishRuleDesc: {
    en: 'You only need 51%+ proof (Preponderance of the Evidence) to win in civil court. Each contract, receipt, or message adds weight to your pan.',
    hi: 'दीवानी अदालत में जीतने के लिए आपको केवल 51%+ सबूत की आवश्यकता होती है। प्रत्येक अनुबंध, रसीद या संदेश आपके पलड़े में भार जोड़ता है।',
    es: 'Solo necesita 51%+ de prueba (Preponderancia de Evidencia) para ganar en juicio civil. Cada contrato, recibo o mensaje añade peso a su platillo.',
    de: 'Vor Zivilgerichten genügen 51%+ Beweise (Beweisüberhang) zum Gewinnen. Jeder Vertrag, Beleg oder Chat wiegt zu Ihren Gunsten.',
    fr: 'Il vous suffit de 51%+ de preuves (Prépondérance de la preuve) pour gagner au civil. Chaque contrat, facture ou SMS fait pencher la balance.',
    ja: '民事裁判で勝訴するには、わずか51%以上の立証（証拠の優越）で足ります。契約書、領収書、メッセージの1つひとつがあなたの天秤皿に重みを加えます。',
    zh: '在民事法庭打官司，您只需超过 51% 的优势证据即可胜诉。每一份协议、转账单或聊天记录都会为您这一侧的天平增加胜算分量。'
  },
  scaleViewBreakdown: {
    en: 'View Evidence Breakdown →',
    hi: 'साक्ष्य विवरण देखें →',
    es: 'Ver Desglose de Pruebas →',
    de: 'Beweis-Aufschlüsselung anzeigen →',
    fr: 'Voir le Détail des Preuves →',
    ja: '証拠の内訳を見る →',
    zh: '查看证据详细拆解 →'
  },

  // Home Dashboard
  homeDisputeSuite: {
    en: 'DISPUTE RESOLUTION SUITE',
    hi: 'विवाद समाधान सूट',
    es: 'SUITE DE RESOLUCIÓN DE DISPUTAS',
    de: 'STREITBEILEGUNGS-SUITE',
    fr: 'SUITE DE RÈGLEMENT DES LITIGES',
    ja: '紛争解決支援スイート',
    zh: '民事争议解决与诉前套件'
  },
  homeCourtLimit: {
    en: 'Limit:',
    hi: 'सीमा:',
    es: 'Límite:',
    de: 'Grenze:',
    fr: 'Plafond :',
    ja: '訴額上限:',
    zh: '小额法庭限额:'
  },
  homeHeroTitle: {
    en: 'Civil Dispute Preparation & Legal Second Opinion',
    hi: 'नागरिक विवाद की तैयारी और कानूनी द्वितीय राय',
    es: 'Preparación de Litigios Civiles y Segunda Opinión Legal',
    de: 'Zivilstreit-Vorbereitung & Juristische Zweitmeinung',
    fr: 'Préparation aux Litiges Civils et Deuxième Avis Juridique',
    ja: '民事紛争準備・法的セカンドオピニオン支援',
    zh: '民事纠纷诉前准备与法律第二意见评估'
  },
  homeHeroSubtitle: {
    en: 'Prepare, substantiate, and negotiate small claims disputes, unreturned deposits, and contract breaches with professional precision without paying high legal retainers.',
    hi: 'उच्च कानूनी फीस चुकाए बिना पेशेवर सटीकता के साथ छोटे दावों के विवादों, वापस न की गई जमा राशि और अनुबंध के उल्लंघनों की तैयारी करें।',
    es: 'Prepare, fundamente y negocie reclamos menores, depósitos no devueltos e incumplimientos contractuales sin pagar costosos anticipos de abogados.',
    de: 'Bereiten Sie Kleinverfahren, nicht erstattete Kautionen und Vertragsbrüche mit juristischer Präzision vor, ohne teure Anwaltsvorschüsse zu zahlen.',
    fr: 'Préparez, étayez et négociez litiges du quotidien, dépôts de garantie non restitués et ruptures de contrat sans payer de coûteuses provisions d’avocat.',
    ja: '高額な着手金を支払うことなく、敷金未返還、契約不履行、小額訴訟を専門家水準の精度で準備・立証・交渉できます。',
    zh: '无需预付昂贵律师代理费，即可按照专业诉讼标准准备、立证并交涉小额借贷、押金未退还及各类合同违约争议。'
  },
  homeInstantAssessment: {
    en: 'Instant Dispute Assessment',
    hi: 'तुरंत विवाद मूल्यांकन',
    es: 'Evaluación Instantánea del Caso',
    de: 'Sofortige Ersteinschätzung',
    fr: 'Évaluation Immédiate du Litige',
    ja: '即時紛争診断',
    zh: '一键案件可行性评估'
  },
  homeStartHere: {
    en: 'Start Here',
    hi: 'यहाँ से शुरू करें',
    es: 'Comenzar Aquí',
    de: 'Hier beginnen',
    fr: 'Commencer Ici',
    ja: 'ここから開始',
    zh: '从此开始'
  },
  homeEditParties: {
    en: 'Edit Case Parties',
    hi: 'पक्षकारों का नाम बदलें',
    es: 'Editar Partes del Caso',
    de: 'Parteien bearbeiten',
    fr: 'Modifier les Parties',
    ja: '当事者を編集',
    zh: '编辑当事人'
  },
  homeTourGuide: {
    en: 'Tour Guide',
    hi: 'टूर गाइड',
    es: 'Guía del Tour',
    de: 'Geführte Tour',
    fr: 'Visite Guidée',
    ja: '操作ツアー',
    zh: '功能导览'
  },
  homeNewDisputeBannerTitle: {
    en: 'New Dispute? Get an Instant Recovery Assessment',
    hi: 'नया विवाद? तुरंत वसूली का आकलन प्राप्त करें',
    es: '¿Nuevo Litigio? Obtenga una Evaluación de Recuperación Inmediata',
    de: 'Neuer Rechtsstreit? Sofortige Durchsetzungschancen ermitteln',
    fr: 'Nouveau Litige ? Obtenez une Évaluation d’Indemnisation Immédiate',
    ja: '新規の紛争ですか？回収可能性の即時診断を受けましょう',
    zh: '遇到了新纠纷？立即进行可主张赔偿即时测算'
  },
  homeNewDisputeBannerDesc: {
    en: 'No legal jargon. Choose your atmosphere, define your goal in 1 tap, and unlock your statutory damage ceiling before doing any paperwork.',
    hi: 'कोई कठिन कानूनी भाषा नहीं। 1 टैप में अपना लक्ष्य तय करें और कोई कागजी कार्रवाई करने से पहले अपना कानूनी मुआवजा जानें।',
    es: 'Sin jerga legal. Defina su objetivo en 1 toque y conozca su techo de indemnización legal antes de redactar documentos.',
    de: 'Ohne Fachchinesisch. Wählen Sie Ihr Ziel mit einem Klick und ermitteln Sie Ihren gesetzlichen Höchstanspruch vor dem Papierkram.',
    fr: 'Zéro jargon. Définissez votre objectif en un clic et découvrez votre plafond légal d’indemnisation avant toute démarche.',
    ja: '難しい法律用語は不要。ワンタップで請求目標を設定し、書類作成前に法定損害賠償の上限額を算出します。',
    zh: '告别晦涩法言法语。一键确认争议类型与索赔目标，在动笔撰写文书前即刻测算出法定顶格赔偿金额。'
  },
  homeLaunchConcierge: {
    en: 'Launch 60-Sec Concierge',
    hi: '60-सेकंड कंसीयज शुरू करें',
    es: 'Iniciar Asistente en 60 Seg',
    de: '60-Sekunden-Assistent starten',
    fr: 'Lancer l’Assistant en 60s',
    ja: '60秒かんたん診断を開始',
    zh: '启动 60 秒极速向导'
  },
  homeRoadmapTitle: {
    en: 'How SueChef Wins Your Dispute (3 Simple Steps)',
    hi: 'SueChef आपके विवाद को कैसे जिताता है (3 सरल कदम)',
    es: 'Cómo SueChef Gana su Disputa (3 Pasos Simples)',
    de: 'So gewinnt SueChef Ihren Streit (3 einfache Schritte)',
    fr: 'Comment SueChef Vous Fait Gagner (3 Étapes Simples)',
    ja: 'SueChef で紛争に勝つ方法（3つの簡単ステップ）',
    zh: 'SueChef 助您维权致胜的三步简易法则'
  },
  homeRoadmapSubtitle: {
    en: 'Designed for everyday people — no complicated legal jargon or expensive lawyer retainers needed.',
    hi: 'सामान्य लोगों के लिए डिज़ाइन किया गया — किसी जटिल कानूनी शब्दावली या महंगे वकीलों की आवश्यकता नहीं है।',
    es: 'Diseñado para personas comunes: sin jerga jurídica complicada ni honorarios desorbitados.',
    de: 'Für den Alltag entwickelt – ohne juristisches Fachchinesisch und ohne teure Anwaltsgebühren.',
    fr: 'Conçu pour tous les justiciables — aucun jargon obscur ni frais d’avocat exorbitants.',
    ja: '一般の方のために設計 — 難解な法律用語や高額な弁護士費用は一切不要です。',
    zh: '专为普通大众打造 — 零门槛轻松上手，无需昂贵律师费，人人皆可捍卫自身合法权益。'
  },
  homeStep1Title: {
    en: 'Fill in Names & Losses',
    hi: 'नाम और नुकसान भरें',
    es: 'Indique Nombres y Pérdidas',
    de: 'Namen & Schäden erfassen',
    fr: 'Renseignez Noms & Préjudices',
    ja: '当事者名と被害額を入力',
    zh: '第一步：填写双方当事人与受损金额'
  },
  homeStep1Desc: {
    en: 'Use clear [e.g., example] placeholders to enter your real story, deposit amount, or unpaid invoice.',
    hi: 'अपनी वास्तविक कहानी, जमा राशि या अवैतनिक इनवॉइस दर्ज करने के लिए स्पष्ट उदाहरण प्लेसहोल्डर का उपयोग करें।',
    es: 'Use marcadores de posición claros [ej., ejemplo] para ingresar su historia real, monto de depósito o factura impagada.',
    de: 'Nutzen Sie anschauliche Platzhalter [z.B. Beispiel], um Ihre echten Daten, Kautionsbeträge oder Rechnungen einzutragen.',
    fr: 'Utilisez les exemples types [ex., exemple] pour saisir votre situation réelle, montant du dépôt ou facture impayée.',
    ja: '分かりやすいサンプル雛形 [例: ○○] をタップし、実際の経緯、敷金額、未払請求書の内容に書き換えます。',
    zh: '参照清晰的 [例如: ○○] 提示文本，直接替换填入您的真实纠纷细节、押金数额或被拖欠账单。'
  },
  homeStep2Title: {
    en: 'Generate Formal Demand & Papers',
    hi: 'औपचारिक मांग और दस्तावेज बनाएं',
    es: 'Genere Requerimiento y Escritos Formales',
    de: 'Formelle Mahnung & Schriftsätze erstellen',
    fr: 'Générez Mise en Demeure & Actes',
    ja: '正式な催告書・裁判書面を自動生成',
    zh: '第二步：一键生成正式催告函与诉状'
  },
  homeStep2Desc: {
    en: 'Produce 14-day pre-lawsuit demand letters citing real state laws and California / NY 28-line numbered court pleadings.',
    hi: 'वास्तविक राज्य कानूनों और 28-पंक्ति वाले अदालती दस्तावेजों का हवाला देते हुए 14-दिवसीय मुकदमा-पूर्व मांग पत्र तैयार करें।',
    es: 'Genere cartas de requerimiento de 14 días citando leyes reales y demandas judiciales numeradas de 28 líneas.',
    de: 'Erstellen Sie 14-tägige Mahnschreiben mit Paragraphenzitaten und formatgerechte 28-Zeilen-Gerichtsschriftsätze.',
    fr: 'Créez des mises en demeure sous 14 jours citant les textes officiels et des actes judiciaires numérotés sur 28 lignes.',
    ja: '実在の法令条文を引用した14日間の提訴予告催告書および正式な28行番号付き裁判所提出書面を自動出力します。',
    zh: '自动起草载明适用法条的 14 天诉前催告函，以及完全符合法院格式要求的 28 行诉讼起诉状。'
  },
  homeStep3Title: {
    en: 'Audit Win Odds & Settle Confidently',
    hi: 'जीतने की संभावना जांचें और विश्वास से समझौता करें',
    es: 'Audite Probabilidades y Pacte con Seguridad',
    de: 'Erfolgsaussichten prüfen & sicher vergleichen',
    fr: 'Évaluez Vos Chances & Négociez en Confiance',
    ja: '勝訴率を検証し自信を持って和解交渉',
    zh: '第三步：审查胜诉概率并胸有成竹和解'
  },
  homeStep3Desc: {
    en: 'Get an objective win percentage grade, spot opponent defense traps, and reach verified free legal aid clinics.',
    hi: 'एक निष्पक्ष जीत प्रतिशत ग्रेड प्राप्त करें, विरोधी के बचाव जाल को पहचानें और सत्यापित कानूनी सहायता क्लीनिक तक पहुंचें।',
    es: 'Obtenga una nota objetiva de éxito, identifique trampas de la defensa y conecte con clínicas de ayuda legal verificadas.',
    de: 'Erhalten Sie eine objektive Erfolgsnote, entlarven Sie gegnerische Verteidigungsfallen und finden Sie kostenlose Rechtshilfe.',
    fr: 'Obtenez une note objective de succès, déjouez les pièges adverses et accédez aux cliniques juridiques gratuites.',
    ja: '客観的な勝訴確率評価を取得し、相手方の反論の罠を先回りで見抜き、認証された無料相談窓口へ繋ぎます。',
    zh: '获得客观公正的胜诉率评级，提前规避对方答辩陷阱，随时按需对接官方核实的公益法律援助资源。'
  },

  // Popular Disputes
  homePopularDisputesTitle: {
    en: 'Choose Your Dispute (Pre-Loaded Legal Elements & Math)',
    hi: 'अपना विवाद चुनें (पहले से लोड किए गए कानूनी तत्व और गणना)',
    es: 'Elija su Disputa (Elementos Legales y Cálculos Precargados)',
    de: 'Fall auswählen (Rechtliche Merkmale & Berechnungen vorgeladen)',
    fr: 'Choisissez Votre Litige (Critères Juridiques & Calculs Préchargés)',
    ja: '紛争タイプを選択（法的要件・計算式をプリロード）',
    zh: '选择纠纷模板（已预载法定要件与顶格赔偿算法）'
  },
  homePopularDisputesSubtitle: {
    en: 'Select a situation to automatically load verified state statutes, statutory penalty formulas, and editable facts.',
    hi: 'सत्यापित राज्य कानूनों, वैधानिक दंड सूत्रों और संपादन योग्य तथ्यों को स्वचालित रूप से लोड करने के लिए एक स्थिति का चयन करें।',
    es: 'Seleccione una situación para cargar automáticamente estatutos verificados, fórmulas de penalización y hechos editables.',
    de: 'Wählen Sie einen Fall, um Gesetze, Strafschadensersatzformeln und bearbeitbare Fakten automatisch zu laden.',
    fr: 'Sélectionnez un cas pour charger automatiquement les lois applicables, formules d’indemnité et faits personnalisables.',
    ja: '類型を選ぶだけで、実在の準拠法条文、法定損害賠償倍率、および編集可能な事実関係が自動ロードされます。',
    zh: '选择您的纠纷场景，系统将自动加载权威适用法条、法定惩罚性赔偿倍数及可直接编辑的事实清单。'
  },

  // Cards
  homeDisputeDepositTitle: {
    en: 'Unreturned Security Deposit',
    hi: 'वापस न की गई सुरक्षा जमा राशि',
    es: 'Fianza / Depósito de Alquiler Retenido',
    de: 'Einbehaltene Mietkaution',
    fr: 'Dépôt de Garantie Non Restitué',
    ja: '未返還の賃貸住宅敷金・保証金',
    zh: '房东恶意扣留租房押金'
  },
  homeDisputeDepositDesc: {
    en: 'Landlord failed to return your deposit or sent bogus repair deductions past the 21-day statutory deadline.',
    hi: 'मकान मालिक आपकी जमा राशि वापस करने में विफल रहा या 21 दिनों की कानूनी समय सीमा के बाद मरम्मत की कटौती भेजी।',
    es: 'El propietario no devolvió la fianza o envió deducciones ficticias de reparaciones fuera del plazo legal de 21 días.',
    de: 'Der Vermieter hat die Kaution nicht fristgerecht zurückgezahlt oder unberechtigte Reparaturabzüge vorgenommen.',
    fr: 'Le bailleur a retenu votre caution ou appliqué des retenues injustifiées au-delà du délai légal de restitution.',
    ja: '家主が法定返還期日を過ぎても敷金を返還しない、あるいは根拠のない不当な修繕費を差し引いている。',
    zh: '房东在法定期限届满后仍未退还押金，或无故开具虚假维修扣费单克扣押金。'
  },
  homeDisputeDepositBadge: {
    en: 'Up to 2x Penalty',
    hi: '2 गुना तक जुर्माना',
    es: 'Hasta 2x Penalización',
    de: 'Bis zu 2-fache Strafe',
    fr: 'Pénalité jusqu’à 2x',
    ja: '最大2倍の法定加算金',
    zh: '可主张最高 2 倍法定惩罚金'
  },
  homeDisputeDepositBtn: {
    en: 'Start Deposit Claim',
    hi: 'जमा दावा शुरू करें',
    es: 'Iniciar Reclamo de Fianza',
    de: 'Kautionsklage starten',
    fr: 'Lancer le Recours Caution',
    ja: '敷金返還請求を開始',
    zh: '开启押金追讨案件'
  },

  homeDisputeContractorTitle: {
    en: 'General Contractor Remodel Breach',
    hi: 'ठेकेदार नवीनीकरण अनुबंध का उल्लंघन',
    es: 'Incumplimiento de Reformas / Contratista',
    de: 'Vertragsbruch Bauunternehmer / Handwerker',
    fr: 'Malfaçons & Abandon de Chantier',
    ja: 'リフォーム工事・請負業者の契約不履行',
    zh: '装修施工方工程瑕疵与违约烂尾'
  },
  homeDisputeContractorDesc: {
    en: 'Contractor abandoned renovation project with defective plumbing, leaks, or substandard construction.',
    hi: 'ठेकेदार ने दोषपूर्ण प्लंबिंग, रिसाव या घटिया निर्माण के साथ नवीनीकरण परियोजना को बीच में ही छोड़ दिया।',
    es: 'El contratista abandonó la reforma dejando fontanería defectuosa, filtraciones o acabados de pésima calidad.',
    de: 'Der Handwerker hat das Projekt abgebrochen und mangelhafte Installationen oder undichte Rohre hinterlassen.',
    fr: 'L’entrepreneur a abandonné le chantier en laissant des malfaçons, fuites ou travaux non conformes.',
    ja: '業者が代金受領後に工事を放棄、給排水管の施工不良や雨漏りなど重大な瑕疵を残した。',
    zh: '装修施工方收取工程款后擅自停工烂尾，水管漏水、瓷砖开裂等施工质量严重不合格。'
  },
  homeDisputeContractorBadge: {
    en: 'Bond Claim Ready',
    hi: 'बॉन्ड दावा तैयार',
    es: 'Reclamo de Fianza Listo',
    de: 'Bürgschaftsklage bereit',
    fr: 'Recours Caution Prêt',
    ja: '保証債務請求に対応',
    zh: '支持向工程履约保函索赔'
  },
  homeDisputeContractorBtn: {
    en: 'Start Contractor Claim',
    hi: 'ठेकेदार दावा शुरू करें',
    es: 'Iniciar Reclamo a Contratista',
    de: 'Handwerkerklage starten',
    fr: 'Lancer le Recours Travaux',
    ja: '請負瑕疵請求を開始',
    zh: '开启装修违约追责'
  },

  homeDisputeFreelanceTitle: {
    en: 'Unpaid Freelance Invoice (FIFA)',
    hi: 'अवैतनिक फ्रीलांस इनवॉइस (FIFA)',
    es: 'Facturas Impagadas de Autónomo / Freelance',
    de: 'Unbezahlte Freelancer-Rechnung',
    fr: 'Facture Freelance Impayée',
    ja: 'フリーランス・外注委託料の未払い',
    zh: '自由职业者劳务费被恶意拖欠'
  },
  homeDisputeFreelanceDesc: {
    en: 'Client accepted deliverables into production but refused payment beyond 30 days under Freelance Protection laws.',
    hi: 'ग्राहक ने कार्य को स्वीकार कर लिया लेकिन फ्रीलांस संरक्षण कानूनों के तहत 30 दिनों के बाद भी भुगतान से इनकार कर दिया।',
    es: 'El cliente aprobó los entregables en producción pero no ha pagado tras más de 30 días.',
    de: 'Der Kunde hat die Arbeitsleistung abgenommen, zahlt die Rechnung jedoch seit über 30 Tagen nicht.',
    fr: 'Le client a validé les livrables mais refuse de régler la facture passé le délai légal de 30 jours.',
    ja: '成果物が検収・納品済みであるにもかかわらず、発注者が正当な理由なく30日以上報酬支払いを拒否。',
    zh: '委托方已验收并上线工作成果，但无理逾期超过 30 天拒绝支付协议约定的劳务报酬。'
  },
  homeDisputeFreelanceBadge: {
    en: 'Double Damages',
    hi: 'दोगुना हर्जाना',
    es: 'Doble Indemnización',
    de: 'Doppelter Schadensersatz',
    fr: 'Dommages Doublés',
    ja: '法定2倍の損害賠償',
    zh: '可主张双倍赔偿'
  },
  homeDisputeFreelanceBtn: {
    en: 'Start Freelance Claim',
    hi: 'फ्रीलांस दावा शुरू करें',
    es: 'Iniciar Reclamo Freelance',
    de: 'Honorarklage starten',
    fr: 'Réclamer mes Honoraires',
    ja: '報酬請求を開始',
    zh: '开启劳务费追讨'
  },

  homeDisputeAutoTitle: {
    en: 'Auto Collision & Property Damage',
    hi: 'वाहन दुर्घटना और संपत्ति की क्षति',
    es: 'Colisión de Vehículos y Daños Materiales',
    de: 'Verkehrsunfall & Sachschaden',
    fr: 'Accident de la Route & Dégâts Matériels',
    ja: '交通事故・車両物損・格落ち損害',
    zh: '交通事故车损理赔与贬值损失'
  },
  homeDisputeAutoDesc: {
    en: 'Other driver at fault in collision; insurance refuses to pay full repair or diminished market value.',
    hi: 'दुर्घटना में अन्य चालक दोषी था; बीमा पूर्ण मरम्मत या घटे हुए बाजार मूल्य का भुगतान करने से इनकार करता है।',
    es: 'El otro conductor tuvo la culpa; la aseguradora rechaza pagar la reparación íntegra o pérdida de valor.',
    de: 'Der Unfallgegner hat den Unfall verschuldet; die Versicherung verweigert Reparaturkosten oder Wertminderung.',
    fr: 'Conducteur adverse responsable ; l’assurance refuse d’indemniser la réparation totale ou la dépréciation.',
    ja: '相手方過失による追突事故。保険会社が適正な修理代や事故減価（格落ち損）の支払いを拒絶。',
    zh: '对方全责发生碰撞交通事故，保险公司拒赔全部实际维修费或拒不赔偿车辆贬值损失。'
  },
  homeDisputeAutoBadge: {
    en: 'Direct + Loss of Use',
    hi: 'प्रत्यक्ष + उपयोग की हानि',
    es: 'Directo + Pérdida de Uso',
    de: 'Direkt + Nutzungsausfall',
    fr: 'Direct + Perte d’Usage',
    ja: '修理代＋代車費用',
    zh: '支持维修费加停运损失'
  },
  homeDisputeAutoBtn: {
    en: 'Start Property Claim',
    hi: 'संपत्ति का दावा शुरू करें',
    es: 'Iniciar Reclamo de Daños',
    de: 'Schadensklage starten',
    fr: 'Lancer le Recours Sinistre',
    ja: '物損賠償請求を開始',
    zh: '开启车损维权'
  },

  homeDisputeFraudTitle: {
    en: 'Auto Dealer Fraud & Deceptive Trade',
    hi: 'ऑटो डीलर धोखाधड़ी और भ्रामक व्यापार',
    es: 'Fraude de Concesionario y Prácticas Engañosas',
    de: 'Autohändler-Betrug & Unlauterer Wettbewerb',
    fr: 'Fraude Automobile & Tromperie Commerciale',
    ja: '中古車販売店の修復歴隠蔽・詐欺的取引',
    zh: '二手车商隐瞒事故车泡水与欺诈销售'
  },
  homeDisputeFraudDesc: {
    en: 'Dealer sold flood/salvage vehicle as clean title accident-free or added unauthorized fees.',
    hi: 'डीलर ने दुर्घटना-मुक्त बताकर बाढ़/सैलवेज वाहन बेच दिया या अनधिकृत शुल्क जोड़ा।',
    es: 'El concesionario vendió un coche siniestrado/inundado como libre de accidentes o cobró gastos ilegales.',
    de: 'Händler verkaufte Unfall- oder Flutwagen als unfallfrei oder verrechnete versteckte Fantasiegebühren.',
    fr: 'Le vendeur a dissimulé un véhicule accidenté/inondé ou facturé des frais illégaux non consentis.',
    ja: '冠水歴や全損事故車を無事故車と偽って販売、あるいは無断で不透明な諸費用を上乗せされた。',
    zh: '车商将泡水车、全损重大事故车伪造成“原版原漆个人车”出售，或恶意捆绑不合理杂费。'
  },
  homeDisputeFraudBadge: {
    en: 'Treble Damages',
    hi: 'तीन गुना हर्जाना',
    es: 'Indemnización Triple',
    de: 'Dreifacher Schadensersatz',
    fr: 'Dommages Triplés',
    ja: '3倍の懲罰的損害賠償',
    zh: '可主张退一赔三'
  },
  homeDisputeFraudBtn: {
    en: 'Start Fraud Claim',
    hi: 'धोखाधड़ी का दावा शुरू करें',
    es: 'Iniciar Reclamo por Fraude',
    de: 'Betrugsklage starten',
    fr: 'Lancer le Recours Fraude',
    ja: '消費者詐欺請求を開始',
    zh: '开启欺诈索赔'
  },

  homeDisputeAirlineTitle: {
    en: 'Flight Cancellation & Lost Baggage',
    hi: 'उड़ान रद्दीकरण और खोया हुआ सामान',
    es: 'Cancelación de Vuelos y Equipaje Perdido',
    de: 'Flugannullierung & Gepäckverlust',
    fr: 'Vol Annulé & Bagages Perdus',
    ja: '航空機欠航・遅延およびロストバゲージ',
    zh: '航班延误取消与行李遗失破损赔偿'
  },
  homeDisputeAirlineDesc: {
    en: 'Airline canceled flight without notice or lost luggage and refused mandatory compensation.',
    hi: 'एयरलाइन ने बिना सूचना के उड़ान रद्द कर दी या सामान खो दिया और अनिवार्य मुआवजे से इनकार कर दिया।',
    es: 'La aerolínea canceló el vuelo sin aviso o extravió el equipaje negándose a pagar la indemnización obligatoria.',
    de: 'Fluggesellschaft strich Flug ohne Vorankündigung oder verlor Gepäck und verweigert Ausgleichszahlung.',
    fr: 'La compagnie a annulé le vol sans préavis ou égaré les valises et refuse l’indemnisation légale.',
    ja: '航空会社が予告なく便を欠航、または手荷物を紛失し、規定の法定補償金支払いを拒否。',
    zh: '航空公司无故延误取消航班或遗失托运行李，拒绝依法履行强制食宿安置及延误法定赔偿。'
  },
  homeDisputeAirlineBadge: {
    en: 'Statutory Reimbursement',
    hi: 'वैधानिक प्रतिपूर्ति',
    es: 'Compensación Estatutaria',
    de: 'Gesetzliche Entschädigung',
    fr: 'Indemnisation Forfaitaire',
    ja: '法定補償金に対応',
    zh: '法定强制赔付'
  },
  homeDisputeAirlineBtn: {
    en: 'Start Airline Claim',
    hi: 'एयरलाइन दावा शुरू करें',
    es: 'Iniciar Reclamo a Aerolínea',
    de: 'Flugklage starten',
    fr: 'Réclamer mon Indemnité Vol',
    ja: '航空補償請求を開始',
    zh: '开启航空维权'
  },

  // Case Parties Modal
  partiesModalTitle: {
    en: 'Dispute Parties & Case Details',
    hi: 'विवाद के पक्षकार और मामले का विवरण',
    es: 'Partes del Litigio y Detalles del Caso',
    de: 'Verfahrensbeteiligte & Falldetails',
    fr: 'Parties au Litige & Informations du Dossier',
    ja: '紛争当事者および事件詳細の編集',
    zh: '案件当事人与诉讼基础信息'
  },
  partiesModalSubtitle: {
    en: 'Edit the real names and addresses for your court papers',
    hi: 'अपने अदालती कागजात के लिए वास्तविक नाम और पते संपादित करें',
    es: 'Edite los nombres y direcciones reales para sus escritos judiciales',
    de: 'Geben Sie die echten Namen und Adressen für Ihre Gerichtsdokumente an',
    fr: 'Renseignez les véritables noms et adresses pour vos actes de justice',
    ja: '裁判所提出書面や催告書に記載する実名・住所を入力します',
    zh: '录入并修改将印在法院诉状与催告函中的真实当事人姓名与送达地址'
  },
  partiesBannerText: {
    en: 'Every field has clear [e.g., example] placeholders.',
    hi: 'प्रत्येक फ़ील्ड में स्पष्ट [उदा., उदाहरण] प्लेसहोल्डर हैं।',
    es: 'Cada campo cuenta con marcadores claros [ej., ejemplo].',
    de: 'Jedes Feld verfügt über klare Platzhalter [z.B. Beispiel].',
    fr: 'Chaque champ comporte des exemples types clairs [ex., exemple].',
    ja: 'すべての入力欄に分かりやすい [例: ○○] の雛形が用意されています。',
    zh: '每个输入框均预设了清晰的 [例如: ○○] 示范占位符。'
  },
  partiesClearBtn: {
    en: 'Clear Example Placeholders',
    hi: 'उदाहरण प्लेसहोल्डर साफ़ करें',
    es: 'Limpiar Marcadores de Ejemplo',
    de: 'Beispiel-Platzhalter leeren',
    fr: 'Effacer les Exemples Modèles',
    ja: 'サンプルの雛形を一括クリア',
    zh: '清空所有示例占位符'
  },
  partiesTabPlaintiff: {
    en: '1. You (Plaintiff)',
    hi: '1. आप (वादी)',
    es: '1. Usted (Demandante)',
    de: '1. Sie (Kläger)',
    fr: '1. Vous (Demandeur)',
    ja: '1. あなた（原告/申立人）',
    zh: '1. 原告/申请人（您）'
  },
  partiesTabDefendant: {
    en: '2. Opponent (Defendant)',
    hi: '2. विरोधी (प्रतिवादी)',
    es: '2. Oponente (Demandado)',
    de: '2. Gegenseite (Beklagter)',
    fr: '2. Adversaire (Défendeur)',
    ja: '2. 相手方（被告）',
    zh: '2. 被告/被申请人（对方）'
  },
  partiesTabTitle: {
    en: '3. Case Title',
    hi: '3. केस शीर्षक',
    es: '3. Título del Caso',
    de: '3. Rubrum / Aktenzeichen',
    fr: '3. Titre du Dossier',
    ja: '3. 事件名・裁判件名',
    zh: '3. 案由与案件标题'
  },
  partiesMatterCaption: {
    en: 'Matter Caption:',
    hi: 'मामले का शीर्षक:',
    es: 'Carátula del Asunto:',
    de: 'Rubrum des Falles:',
    fr: 'Intitulé de l’Affaire :',
    ja: '事件の見出し（Caption）:',
    zh: '裁判文书案由抬头:'
  },
  partiesAutoSync: {
    en: 'Auto-syncs live',
    hi: 'लाइव ऑटो-सिंक होता है',
    es: 'Sincronización en vivo',
    de: 'Synchronisiert automatisch',
    fr: 'Synchronisé en direct',
    ja: 'リアルタイム自動反映',
    zh: '文书全局实时联动'
  },
  partiesPlaintiffInfoTitle: {
    en: 'Plaintiff / Claimant Information:',
    hi: 'वादी / दावेदार की जानकारी:',
    es: 'Información del Demandante / Reclamante:',
    de: 'Angaben zum Kläger / Antragsteller:',
    fr: 'Coordonnées du Demandeur :',
    ja: '原告（請求者）の基本情報:',
    zh: '原告/起诉人身份信息:'
  },
  partiesPlaintiffInfoDesc: {
    en: 'This is you (the person or business bringing the claim). This information will appear on the header of all court filings, demand letters, and declarations.',
    hi: 'यह आप हैं (दावा लाने वाला व्यक्ति या व्यवसाय)। यह जानकारी सभी अदालती फाइलिंग, मांग पत्रों और घोषणाओं के शीर्ष पर दिखाई देगी।',
    es: 'Este es usted (la persona o empresa que presenta la demanda). Aparecerá en el encabezado de todos los escritos y cartas de requerimiento.',
    de: 'Das sind Sie (die klagende Partei). Diese Angaben erscheinen im Briefkopf aller Schriftsätze und Mahnschreiben.',
    fr: 'Il s’agit de vous (la personne ou l’entreprise qui agit). Ces informations figureront sur l’en-tête de tous les actes et courriers.',
    ja: 'これはあなた（訴訟や請求を起こす個人または法人）です。この情報はすべての裁判書面、催告書、宣誓供述書のヘッダーに印字されます。',
    zh: '此项为您本人（提起诉讼或索赔的个人或企业）。该信息将直接体现在所有法院诉状、催告公函及证据声明书的题头。'
  },
  partiesDefendantInfoTitle: {
    en: 'Defendant / Opposing Party Information:',
    hi: 'प्रतिवादी / विरोधी पक्ष की जानकारी:',
    es: 'Información del Demandado / Parte Contraria:',
    de: 'Angaben zum Beklagten / Gegenseite:',
    fr: 'Coordonnées du Défendeur / Adversaire :',
    ja: '被告（相手方当事者）の情報:',
    zh: '被告/对方当事人信息:'
  },
  partiesDefendantInfoDesc: {
    en: 'This is the person, landlord, or company you are taking action against. Exact legal names are critical for judgment enforcement.',
    hi: 'यह वह व्यक्ति, मकान मालिक या कंपनी है जिसके खिलाफ आप कार्रवाई कर रहे हैं। निर्णय के प्रवर्तन के लिए सटीक कानूनी नाम महत्वपूर्ण हैं।',
    es: 'Es la persona, casero o empresa contra la que actúa. Los nombres legales exactos son cruciales para ejecutar sentencias.',
    de: 'Dies ist die Person oder Firma, gegen die Sie vorgehen. Exakte Firmenbezeichnungen sind entscheidend für die Vollstreckung.',
    fr: 'Il s’agit de la personne, du propriétaire ou de la société visée. Les noms exacts sont essentiels pour l’exécution du jugement.',
    ja: 'あなたが請求を行う相手方（個人、家主、または法人）です。将来の差押え・強制執行を確実に遂行するため、正確な法的名称が必要です。',
    zh: '即被您起诉索赔的个人、房东或企业。准确无误的主体法定全称是后续判决执行、银行财产扣押的关键前提。'
  },
  partiesCaseTitleInfoTitle: {
    en: 'Formal Case Title & Caption:',
    hi: 'औपचारिक केस शीर्षक और कैप्शन:',
    es: 'Título Formal del Caso y Carátula:',
    de: 'Offizielles Rubrum & Falltitel:',
    fr: 'Titre Officiel de l’Affaire :',
    ja: '正式な事件件名・表題:',
    zh: '正式裁判文书案由抬头:'
  },
  partiesCaseTitleInfoDesc: {
    en: 'This title appears on all court pleadings and notices. By default, it auto-derives from party names (e.g., "Plaintiff v. Defendant").',
    hi: 'यह शीर्षक सभी अदालती दस्तावेजों और नोटिसों पर दिखाई देता है। डिफ़ॉल्ट रूप से, यह पक्षकारों के नामों से स्वतः बनता है।',
    es: 'Este título aparece en todos los escritos judiciales. Por defecto, se deriva automáticamente de los nombres de las partes.',
    de: 'Dieser Titel steht auf allen Schriftsätzen. Standardmäßig leitet er sich aus den Namen ab (z.B. "Kläger gegen Beklagten").',
    fr: 'Ce titre figure sur tous les actes de procédure. Par défaut, il est dérivé des noms des parties (ex. "Demandeur c/ Défendeur").',
    ja: 'この表題は裁判書類の最上部に印字されます。通常は当事者名から自動生成されます（例: 「原告 vs 被告」）。',
    zh: '该标题将直接展示在全部起诉书与送达通知书正上方。默认情况下根据双方当事人全名自动生成（如“原告 诉 被告”）。'
  },
  partiesFullNameLabel: {
    en: 'Your Full Legal Name or Registered Business Name *',
    hi: 'आपका पूरा कानूनी नाम या पंजीकृत व्यावसायिक नाम *',
    es: 'Su Nombre Legal Completo o Razón Social *',
    de: 'Ihr vollständiger Name oder eingetragener Firmenname *',
    fr: 'Votre Nom Légal Complet ou Raison Sociale *',
    ja: 'あなたの法的氏名または登記上の商号 *',
    zh: '您的法定真实姓名或企业登记全称 *'
  },
  partiesOpponentNameLabel: {
    en: 'Opponent Full Legal Name or Company Name *',
    hi: 'विरोधी का पूरा कानूनी नाम या कंपनी का नाम *',
    es: 'Nombre Legal Completo de la Contraparte o Empresa *',
    de: 'Vollständiger Name der Gegenseite oder Firmenname *',
    fr: 'Nom Légal Complet de l’Adversaire ou Société *',
    ja: '相手方の法的氏名または法人登記名 *',
    zh: '对方当事人真实姓名或企业工商登记全称 *'
  },
  partiesNameHelper: {
    en: 'Use your exact name as shown on government ID or lease.',
    hi: 'सरकारी पहचान पत्र या पट्टे पर दिखाए गए अपने सटीक नाम का उपयोग करें।',
    es: 'Use su nombre exacto tal como figura en su documento de identidad o contrato.',
    de: 'Verwenden Sie Ihren Namen exakt wie im Ausweis oder Mietvertrag angegeben.',
    fr: 'Indiquez votre nom exact tel qu’il figure sur votre pièce d’identité ou bail.',
    ja: '身分証明書や賃貸借契約書に記載されている正式な表記を入力してください。',
    zh: '请填写与居民身份证、护照或租赁合同中完全一致的法定名字。'
  },
  partiesOpponentNameHelper: {
    en: 'For businesses, check state business registry (LLC, Inc, Corp).',
    hi: 'व्यवसायों के लिए, राज्य व्यापार रजिस्ट्री (LLC, Inc, Corp) की जांच करें।',
    es: 'Para empresas, verifique el registro mercantil oficial (S.L., S.A., LLC).',
    de: 'Bei Unternehmen bitte das offizielle Handelsregister prüfen (GmbH, AG, LLC).',
    fr: 'Pour les entreprises, vérifiez la dénomination au registre du commerce (SARL, SAS).',
    ja: '企業の場合は、商業登記簿に記載された正確な商号（株式会社、合同会社等）をご確認ください。',
    zh: '如对方为企业，请在全国企业信用信息公示系统或州工商注册处核实公司准确后缀（有限公司、股份公司等）。'
  },
  partiesEntityTypeLabel: {
    en: 'Entity Type',
    hi: 'इकाई का प्रकार',
    es: 'Tipo de Entidad',
    de: 'Rechtsform',
    fr: 'Forme Juridique',
    ja: '法的主体・法人格',
    zh: '主体资格类型'
  },
  entityIndividual: {
    en: 'Individual (Human Person)',
    hi: 'व्यक्ति (प्राकृतिक व्यक्ति)',
    es: 'Persona Física / Natural',
    de: 'Natürliche Person',
    fr: 'Personne Physique',
    ja: '自然人（個人）',
    zh: '自然人（个人）'
  },
  entitySoleProp: {
    en: 'Sole Proprietorship / DBA',
    hi: 'एकल स्वामित्व / DBA',
    es: 'Empresario Individual / Autónomo',
    de: 'Einzelunternehmen / Freiberufler',
    fr: 'Entreprise Individuelle / Auto-entrepreneur',
    ja: '個人事業主（屋号）',
    zh: '个体工商户 / 个人独资企业'
  },
  entityLlc: {
    en: 'Limited Liability Company (LLC)',
    hi: 'सीमित देयता कंपनी (LLC)',
    es: 'Sociedad de Responsabilidad Limitada (S.L. / LLC)',
    de: 'Gesellschaft mit beschränkter Haftung (GmbH / LLC)',
    fr: 'Société à Responsabilité Limitée (SARL / SAS)',
    ja: '合同会社（LLC）',
    zh: '有限责任公司 (LLC)'
  },
  entityCorp: {
    en: 'Corporation (Inc / Corp)',
    hi: 'निगम (Inc / Corp)',
    es: 'Sociedad Anónima (S.A. / Corp)',
    de: 'Aktiengesellschaft (AG / Inc / Corp)',
    fr: 'Société par Actions (SA / Corp)',
    ja: '株式会社（Corporation / Inc.）',
    zh: '股份有限公司 (Inc / Corp)'
  },
  partiesPhoneLabel: {
    en: 'Phone Number',
    hi: 'फ़ोन नंबर',
    es: 'Número de Teléfono',
    de: 'Telefonnummer',
    fr: 'Numéro de Téléphone',
    ja: '電話番号',
    zh: '联系电话'
  },
  partiesAddressLabel: {
    en: 'Street Address (Mailing Address for Court Notices)',
    hi: 'पता (अदालती नोटिस के लिए डाक पता)',
    es: 'Dirección (Domicilio para Notificaciones Judiciales)',
    de: 'Straße & Hausnummer (Ladungsfähige Anschrift)',
    fr: 'Adresse Postale (Pour les Notifications Judiciaires)',
    ja: '住所（裁判所からの呼出状・通知の送達先）',
    zh: '详细街道地址（法院文书有效送达通讯地址）'
  },
  partiesCityLabel: {
    en: 'City',
    hi: 'शहर',
    es: 'Ciudad',
    de: 'Stadt',
    fr: 'Ville',
    ja: '市区町村',
    zh: '城市'
  },
  partiesStateLabel: {
    en: 'State / Province',
    hi: 'राज्य / प्रांत',
    es: 'Estado / Provincia',
    de: 'Bundesland / Kanton',
    fr: 'Région / Département',
    ja: '都道府県',
    zh: '省份 / 州'
  },
  partiesZipLabel: {
    en: 'Zip / Postal Code',
    hi: 'पिन कोड',
    es: 'Código Postal',
    de: 'Postleitzahl (PLZ)',
    fr: 'Code Postal',
    ja: '郵便番号',
    zh: '邮政编码'
  },
  partiesEmailLabel: {
    en: 'Email Address',
    hi: 'ईमेल पता',
    es: 'Correo Electrónico',
    de: 'E-Mail-Adresse',
    fr: 'Adresse E-mail',
    ja: 'メールアドレス',
    zh: '电子邮箱'
  },
  partiesRegisteredAgentLabel: {
    en: 'Registered Agent for Service of Process (Corporations / LLCs)',
    hi: 'तामील के लिए पंजीकृत एजेंट (निगम / LLC)',
    es: 'Agente Registrado para Notificaciones (Sociedades / LLC)',
    de: 'Zustellungsbevollmächtigter (für Firmen & juristische Personen)',
    fr: 'Agent Enregistré pour la Signification (Sociétés)',
    ja: '送達受任者・登記上の代理人（法人の場合）',
    zh: '诉讼文书送达法定接收人 / 注册代理人（针对企业法人）'
  },
  partiesRegisteredAgentHelper: {
    en: 'In corporate filings, summons must be served to their designated registered agent.',
    hi: 'कॉर्पोरेट फाइलिंग में, सम्मन उनके निर्दिष्ट पंजीकृत एजेंट को दिया जाना चाहिए।',
    es: 'En demandas a empresas, la citación debe entregarse a su agente registrado.',
    de: 'Bei Klagen gegen Firmen muss die Zustellung an den offiziellen Vertreter erfolgen.',
    fr: 'Pour les sociétés, l’assignation doit être délivrée au représentant légal désigné.',
    ja: '法人を提訴する場合、法的に有効な送達を行うため登記上の代表者または送達受任者に宛てる必要があります。',
    zh: '针对企业的诉讼，法院传票必须送达给其在工商登记处备案的法定代表人或注册代理人。'
  },
  partiesCustomTitleLabel: {
    en: 'Custom Legal Case Title',
    hi: 'कस्टम कानूनी केस शीर्षक',
    es: 'Título Personalizado del Caso',
    de: 'Benutzerdefinierter Falltitel',
    fr: 'Titre Personnalisé de l’Affaire',
    ja: 'カスタム裁判事件名',
    zh: '自定义诉讼案件抬头名称'
  },
  partiesResetTitleBtn: {
    en: 'Reset to Auto-Derived Title',
    hi: 'स्वतः-व्युत्पन्न शीर्षक पर रीसेट करें',
    es: 'Restablecer a Título Automático',
    de: 'Auf Standardrubrum zurücksetzen',
    fr: 'Rétablir le Titre Automatique',
    ja: '自動生成された標準件名に戻す',
    zh: '恢复按当事人姓名自动生成'
  },
  partiesNextOpponentBtn: {
    en: 'Next: Opponent →',
    hi: 'आगे: विरोधी →',
    es: 'Siguiente: Oponente →',
    de: 'Weiter: Gegenseite →',
    fr: 'Suivant : Adversaire →',
    ja: '次へ: 相手方（被告）→',
    zh: '下一步：对方当事人 →'
  },
  partiesNextTitleBtn: {
    en: 'Next: Case Title →',
    hi: 'आगे: केस शीर्षक →',
    es: 'Siguiente: Título →',
    de: 'Weiter: Falltitel →',
    fr: 'Suivant : Titre de l’Affaire →',
    ja: '次へ: 事件名 →',
    zh: '下一步：案件标题 →'
  },
  partiesSaveDetailsBtn: {
    en: 'Save Details',
    hi: 'विवरण सहेजें',
    es: 'Guardar Detalles',
    de: 'Angaben speichern',
    fr: 'Enregistrer',
    ja: '変更内容を保存',
    zh: '保存当事人信息'
  },
  partiesSavedToast: {
    en: 'Parties and caption updated successfully!',
    hi: 'पक्षकार और शीर्षक सफलतापूर्वक अपडेट किए गए!',
    es: '¡Partes y carátula actualizadas con éxito!',
    de: 'Beteiligte & Rubrum erfolgreich aktualisiert!',
    fr: 'Parties et intitulé mis à jour avec succès !',
    ja: '当事者情報および事件名が正常に更新されました！',
    zh: '当事人信息与文书抬头已成功保存！'
  },

  // Sample Placeholders
  samplePlaintiffName: {
    en: 'Jordan Smith [Sample — Tap to Put Your Name]',
    hi: 'जॉर्डन स्मिथ [नमूना — अपना नाम लिखने के लिए टैप करें]',
    es: 'Jordan Smith [Ejemplo — Toca para poner tu nombre]',
    de: 'Jordan Smith [Beispiel — Tippen, um Namen einzugeben]',
    fr: 'Jordan Smith [Exemple — Appuyez pour saisir votre nom]',
    ja: 'ジョーダン・スミス [サンプル — あなたの氏名を入力]',
    zh: '乔丹·史密斯 [示例 — 点击输入您的姓名]'
  },
  sampleDefendantName: {
    en: 'Apex Property Management LLC [Sample — Opponent Name]',
    hi: 'एपेक्स प्रॉपर्टी मैनेजमेंट LLC [नमूना — विरोधी का नाम]',
    es: 'Apex Property Management LLC [Ejemplo — Nombre del Oponente]',
    de: 'Apex Property Management LLC [Beispiel — Name der Gegenseite]',
    fr: 'Apex Property Management LLC [Exemple — Nom de l’Adversaire]',
    ja: 'エイペックス不動産管理合同会社 [サンプル — 相手方名称を入力]',
    zh: '先锋物业管理有限责任公司 [示例 — 点击输入对方名称]'
  },
  samplePhonePlaceholder: {
    en: '[e.g., (650) 555-0192]',
    hi: '[उदा., (650) 555-0192]',
    es: '[ej., (650) 555-0192]',
    de: '[z.B. (650) 555-0192]',
    fr: '[ex., (650) 555-0192]',
    ja: '[例: (650) 555-0192]',
    zh: '[例如: (650) 555-0192]'
  },
  sampleAddressPlaceholder: {
    en: '[e.g., 450 University Avenue, Apt 3B]',
    hi: '[उदा., 450 यूनिवर्सिटी एवेन्यू, फ्लैट 3B]',
    es: '[ej., 450 University Avenue, Apt 3B]',
    de: '[z.B. 450 University Avenue, Whg. 3B]',
    fr: '[ex., 450 University Avenue, Appt 3B]',
    ja: '[例: ユニバーシティ通り450番地 3B号室]',
    zh: '[例如: 大学城南路 450 号 3B 室]'
  },
  sampleCityPlaceholder: {
    en: '[e.g., Palo Alto]',
    hi: '[उदा., पालो ऑल्टो]',
    es: '[ej., Palo Alto]',
    de: '[z.B. Palo Alto]',
    fr: '[ex., Palo Alto]',
    ja: '[例: パロアルト市]',
    zh: '[例如: 帕洛阿托市]'
  },
  sampleZipPlaceholder: {
    en: '[e.g., 94301]',
    hi: '[उदा., 94301]',
    es: '[ej., 94301]',
    de: '[z.B. 94301]',
    fr: '[ex., 94301]',
    ja: '[例: 94301]',
    zh: '[例如: 94301]'
  },
  sampleEmailPlaceholder: {
    en: '[e.g., claimant@example.com]',
    hi: '[उदा., claimant@example.com]',
    es: '[ej., demandante@ejemplo.com]',
    de: '[z.B. klaeger@beispiel.de]',
    fr: '[ex., demandeur@exemple.fr]',
    ja: '[例: claimant@example.com]',
    zh: '[例如: claimant@example.com]'
  },
  sampleOpponentAddressPlaceholder: {
    en: '[e.g., 100 Commercial Blvd, Suite 200]',
    hi: '[उदा., 100 कमर्शियल बुलेवार्ड, सुइट 200]',
    es: '[ej., 100 Commercial Blvd, Suite 200]',
    de: '[z.B. 100 Commercial Blvd, Büro 200]',
    fr: '[ex., 100 Commercial Blvd, Bureau 200]',
    ja: '[例: コマーシャル大通り100番地 200号室]',
    zh: '[例如: 商业大道 100 号 200 室]'
  },
  sampleOpponentCityPlaceholder: {
    en: '[e.g., Los Angeles]',
    hi: '[उदा., लॉस एंजिल्स]',
    es: '[ej., Los Ángeles]',
    de: '[z.B. Los Angeles]',
    fr: '[ex., Los Angeles]',
    ja: '[例: ロサンゼルス市]',
    zh: '[例如: 洛杉矶市]'
  },
  sampleOpponentZipPlaceholder: {
    en: '[e.g., 90001]',
    hi: '[उदा., 90001]',
    es: '[ej., 90001]',
    de: '[z.B. 90001]',
    fr: '[ex., 90001]',
    ja: '[例: 90001]',
    zh: '[例如: 90001]'
  },
  sampleOpponentPhonePlaceholder: {
    en: '[e.g., (555) 321-7654]',
    hi: '[उदा., (555) 321-7654]',
    es: '[ej., (555) 321-7654]',
    de: '[z.B. (555) 321-7654]',
    fr: '[ex., (555) 321-7654]',
    ja: '[例: (555) 321-7654]',
    zh: '[例如: (555) 321-7654]'
  },
  sampleOpponentEmailPlaceholder: {
    en: '[e.g., notices@apexpm.com]',
    hi: '[उदा., notices@apexpm.com]',
    es: '[ej., avisos@apexpm.com]',
    de: '[z.B. mahnung@apexpm.de]',
    fr: '[ex., contentieux@apexpm.fr]',
    ja: '[例: notices@apexpm.com]',
    zh: '[例如: legal@apexpm.com]'
  },
  sampleAgentPlaceholder: {
    en: '[e.g., Legal Department / CT Corporation System]',
    hi: '[उदा., कानूनी विभाग / CT कॉर्पोरेशन सिस्टम]',
    es: '[ej., Departamento Legal / CT Corporation System]',
    de: '[z.B. Rechtsabteilung / CT Corporation]',
    fr: '[ex., Service Juridique / CT Corporation]',
    ja: '[例: 法務部 / CTコーポレーション システム]',
    zh: '[例如: 法务合规部 / CT Corporation System 法定送达人]'
  },

  // Dispute Blueprints & Vault (CaseManagerModal)
  vaultModalTitle: {
    en: 'Dispute Matter Switcher & Blueprint Vault',
    hi: 'विवाद मामला स्विचर और ब्लूप्रिंट वॉल्ट',
    es: 'Selector de Asuntos y Bóveda de Plantillas',
    de: 'Fall-Umschalter & Vorlagen-Tresor',
    fr: 'Sélecteur de Dossier & Bóveda de Modèles',
    ja: '事件切替および紛争類型ブループリント保管庫',
    zh: '案件切换中心与典型纠纷预设模板库'
  },
  vaultActiveMatter: {
    en: 'Active Matter:',
    hi: 'सक्रिय मामला:',
    es: 'Asunto Activo:',
    de: 'Aktiver Fall:',
    fr: 'Dossier Actif :',
    ja: '現在進行中の事件:',
    zh: '当前正在处理的案件:'
  },
  vaultTabBlueprints: {
    en: '6 Real-World Dispute Blueprints',
    hi: '6 वास्तविक दुनिया के विवाद ब्लूप्रिंट',
    es: '6 Plantillas Reales de Disputas',
    de: '6 Praxis-Vorlagen für Rechtsstreitigkeiten',
    fr: '6 Modèles de Litiges Concrets',
    ja: '実務に即した6つの典型紛争テンプレート',
    zh: '6 款精选真实民事纠纷诉讼蓝图'
  },
  vaultTabCustom: {
    en: 'Create Custom Matter from Scratch',
    hi: 'शुरुआत से कस्टम मामला बनाएं',
    es: 'Crear Asunto Personalizado desde Cero',
    de: 'Eigenen Fall neu anlegen',
    fr: 'Créer un Dossier Personnalisé',
    ja: '白紙から新しい事件を作成',
    zh: '从零新建自定义纠纷案件'
  },
  vaultJurisdiction: {
    en: 'JURISDICTION',
    hi: 'अधिकार क्षेत्र',
    es: 'JURISDICCIÓN',
    de: 'GERICHTSSTAND',
    fr: 'JURIDICTION',
    ja: '管轄裁判所',
    zh: '司法管辖区域'
  },
  vaultEstimatedClaim: {
    en: 'Estimated Claim:',
    hi: 'अनुमानित दावा:',
    es: 'Reclamo Estimado:',
    de: 'Geschätzter Streitwert:',
    fr: 'Montant Estimé :',
    ja: '推定請求額:',
    zh: '预估索赔标的额:'
  },
  vaultActiveWorkspace: {
    en: 'Active Workspace',
    hi: 'सक्रिय कार्यक्षेत्र',
    es: 'Espacio de Trabajo Activo',
    de: 'Aktiver Arbeitsbereich',
    fr: 'Dossier en Cours',
    ja: '現在の作業領域',
    zh: '当前正在编辑'
  },
  vaultLoadBlueprint: {
    en: 'Load Blueprint',
    hi: 'ब्लूप्रिंट लोड करें',
    es: 'Cargar Plantilla',
    de: 'Vorlage laden',
    fr: 'Charger le Modèle',
    ja: 'このテンプレートを読込',
    zh: '加载此案件蓝图'
  },
  vaultCustomTitleLabel: {
    en: 'Dispute Matter Title',
    hi: 'विवाद मामले का शीर्षक',
    es: 'Título del Asunto en Disputa',
    de: 'Bezeichnung des Rechtsstreits',
    fr: 'Intitulé du Litige',
    ja: '事件の名称',
    zh: '争议案件名称'
  },
  vaultCustomCategoryLabel: {
    en: 'Dispute Category',
    hi: 'विवाद श्रेणी',
    es: 'Categoría de la Disputa',
    de: 'Rechtsgebiet / Streitkategorie',
    fr: 'Catégorie de Litige',
    ja: '紛争カテゴリ',
    zh: '案由法定分类'
  },
  vaultCustomStateLabel: {
    en: 'State / Jurisdiction',
    hi: 'राज्य / क्षेत्राधिकार',
    es: 'Estado / Jurisdicción',
    de: 'Bundesstaat / Gerichtsstand',
    fr: 'État / Juridiction',
    ja: '州 / 管轄地域',
    zh: '州 / 司法管辖区'
  },
  vaultCreateMatterBtn: {
    en: 'Create & Open Matter',
    hi: 'मामला बनाएं और खोलें',
    es: 'Crear y Abrir Asunto',
    de: 'Fall anlegen & öffnen',
    fr: 'Créer & Ouvrir le Dossier',
    ja: '事件を作成して開く',
    zh: '立即创建并载入工作区'
  },

  // 14-Step Guided Tour (WalkthroughTour)
  tourStepCounter: {
    en: 'TOUR STEP {current} OF {total}',
    hi: 'टूर चरण {current} / {total}',
    es: 'PASO DEL TOUR {current} DE {total}',
    de: 'TOUR-SCHRITT {current} VON {total}',
    fr: 'ÉTAPE DU TOUR {current} SUR {total}',
    ja: 'ガイドツアー ステップ {current} / {total}',
    zh: '功能导览 第 {current} 步（共 {total} 步）'
  },
  tourActive: {
    en: 'Active:',
    hi: 'सक्रिय:',
    es: 'Activo:',
    de: 'Aktiv:',
    fr: 'Actif :',
    ja: '対象画面:',
    zh: '对应工作台:'
  },
  tourNextStep: {
    en: 'Next Step →',
    hi: 'अगला चरण →',
    es: 'Siguiente Paso →',
    de: 'Nächster Schritt →',
    fr: 'Étape Suivante →',
    ja: '次のステップへ →',
    zh: '下一步 →'
  },
  tourPreviousStep: {
    en: '← Back',
    hi: '← वापस',
    es: '← Anterior',
    de: '← Zurück',
    fr: '← Précédent',
    ja: '← 前へ',
    zh: '← 上一步'
  },
  tourFinishTour: {
    en: 'Finish Tour & Start Case 🚀',
    hi: 'टूर समाप्त करें और केस शुरू करें 🚀',
    es: 'Finalizar Tour y Comenzar Caso 🚀',
    de: 'Tour beenden & Fall starten 🚀',
    fr: 'Terminer la Visite & Démarrer 🚀',
    ja: 'ツアーを終了して事件を開始 🚀',
    zh: '完成导览并开始办案 🚀'
  },
  tourStep1Title: {
    en: 'Executive Dashboard & Dispute Intake',
    hi: 'कार्यकारी डैशबोर्ड और विवाद इनटेक',
    es: 'Panel Ejecutivo y Entrada de Disputas',
    de: 'Übersichts-Dashboard & Fall-Erfassung',
    fr: 'Tableau de Bord & Enregistrement du Litige',
    ja: '総合ダッシュボード＆紛争受付診断',
    zh: '总览控制台与纠纷诊断中心'
  },
  tourStep1Subtitle: {
    en: 'Your Central Legal Command Center',
    hi: 'आपका केंद्रीय कानूनी कमान केंद्र',
    es: 'Su Centro de Control Legal',
    de: 'Ihre juristische Kommandozentrale',
    fr: 'Votre Centre de Commandement Juridique',
    ja: 'すべての紛争処理を統括する司令塔',
    zh: '您的诉讼维权总指挥部'
  },
  tourStep1Desc: {
    en: 'Track your dispute metrics, estimated damages, merit strength percentage, and calculated attorney fee savings all in one clean place.',
    hi: 'अपने विवाद के मेट्रिक्स, अनुमानित नुकसान, जीत की संभावना और वकील की फीस की बचत को एक ही स्थान पर ट्रैक करें।',
    es: 'Controle métricas de su disputa, daños estimados, porcentaje de solidez y ahorro calculado en abogados.',
    de: 'Überwachen Sie Streitwerte, geschätzte Schäden, Erfolgsaussichten und gesparte Anwaltsgebühren an einem Ort.',
    fr: 'Suivez les indicateurs clés, dommages estimés, pourcentage de solidité et économies d’avocat.',
    ja: '請求損害額、勝訴確率、節約できた弁護士費用など、紛争の重要指標を一目で把握できます。',
    zh: '在一个清晰的界面中集中跟踪案件索赔金额、胜诉优势指数以及为您累计节省的律师代理费用。'
  },
  tourStep1Tip: {
    en: 'Answer 4 intake questions to calculate statutory damages and generate your dispute file.',
    hi: 'वैधानिक नुकसान की गणना करने और अपनी विवाद फ़ाइल बनाने के लिए 4 प्रश्नों के उत्तर दें।',
    es: 'Responda 4 preguntas para calcular daños estatutarios y generar su expediente.',
    de: 'Beantworten Sie 4 Fragen zur Berechnung der Schadenshöhe und Aktenanlage.',
    fr: 'Répondez à 4 questions pour calculer vos dommages légaux et créer votre dossier.',
    ja: '4つの基本質問に答えるだけで、法定損害額を自動計算し事件ファイルを即座に生成します。',
    zh: '回答 4 个关键问卷问题，即可自动计算法定顶格赔偿并生成专属案件电子档案。'
  },

  tourStep2Title: {
    en: '1. Build Case & Legal Elements',
    hi: '1. मामला बनाएं और कानूनी तत्व',
    es: '1. Armar Caso y Elementos Jurídicos',
    de: '1. Fall aufbauen & Anspruchsvoraussetzungen',
    fr: '1. Monter le Dossier & Éléments Juridiques',
    ja: '1. 主張の構築と法定要件の整理',
    zh: '1. 确立诉求与法律构成要件'
  },
  tourStep2Subtitle: {
    en: 'Damage Calculator & Statutory Multipliers',
    hi: 'नुकसान कैलकुलेटर और वैधानिक गुणक',
    es: 'Calculadora de Daños y Multiplicadores Legales',
    de: 'Schadensrechner & Gesetzliche Multiplikatoren',
    fr: 'Calculateur de Dommages & Multiplicateurs Légaux',
    ja: '損害額カリキュレーター＆法定賠償倍率',
    zh: '损失计算器与法定惩罚性倍数'
  },
  tourStep2Desc: {
    en: 'Itemize direct, consequential, and bad-faith statutory penalty damages (1x/2x/3x) and verify small claims court eligibility.',
    hi: 'प्रत्यक्ष, परिणामी और दुर्भावनापूर्ण वैधानिक हर्जाने (1x/2x/3x) को सूचीबद्ध करें और पात्रता सत्यापित करें।',
    es: 'Desglose daños directos, consecuenciales y multas de mala fe (1x/2x/3x) y compruebe límites de juicio verbal.',
    de: 'Schlüsseln Sie Schäden und gesetzliche Strafzuschläge (1x/2x/3x) auf und prüfen Sie die Bagatellgrenzen.',
    fr: 'Ventilez préjudices directs, pertes consécutives et pénalités de mauvaise foi (1x/2x/3x).',
    ja: '直接損害、派生損害、悪質な不当利得に対する法定加算倍率（1倍/2倍/3倍）を項目別に算定します。',
    zh: '逐项列明直接经济损失、连带间接损失以及恶意惩罚性赔偿（1/2/3倍），核实小额法庭受案限额。'
  },
  tourStep2Tip: {
    en: 'Check off prima facie legal elements to ensure your claim meets statutory requirements.',
    hi: 'प्रथम दृष्टया कानूनी तत्वों की जांच करें ताकि यह सुनिश्चित हो सके कि आपका दावा पूरा है।',
    es: 'Marque los elementos legales prima facie para comprobar que cumple los requisitos estatutarios.',
    de: 'Haken Sie die Anspruchsgrundlagen ab, um die gesetzliche Schlüssigkeit sicherzustellen.',
    fr: 'Cochez les conditions légales prima facie pour valider la recevabilité de votre demande.',
    ja: '請求権の根拠となる法定要件をチェックし、訴訟の要件が満たされているか確認しましょう。',
    zh: '逐一核对请求权基础法定构成要件，确保诉讼请求具备完整的法理与证据闭环支撑。'
  },

  tourStep3Title: {
    en: '2. Evidence Locker & Cryptographic Vault',
    hi: '2. साक्ष्य लॉकर और क्रिप्टोग्राफ़िक वॉल्ट',
    es: '2. Bóveda de Pruebas y Custodia Criptográfica',
    de: '2. Beweis-Tresor & Kryptografischer Schutz',
    fr: '2. Coffre à Preuves & Sécurisation Numérique',
    ja: '2. 証拠ロッカー＆暗号化保管庫',
    zh: '2. 证据保全保险箱与数字哈希存证'
  },
  tourStep3Subtitle: {
    en: 'Tamper-Proof SHA-256 Digest Verification',
    hi: 'छेड़छाड़-प्रूफ SHA-256 सत्यापन',
    es: 'Verificación Hash SHA-256 Inviolable',
    de: 'Manipulationssicherer SHA-256 Prüfsummennachweis',
    fr: 'Vérification d’Empreinte Numérique SHA-256 Infalsifiable',
    ja: '改ざん不可能なSHA-256ハッシュ検証',
    zh: '防篡改 SHA-256 电子数据指纹存证'
  },
  tourStep3Desc: {
    en: 'Secure leases, bank wires, inspection photos, and reconstructed SMS threads with Federal Rule of Evidence 902 digital digests and privacy redactions.',
    hi: 'पट्टे, बैंक ट्रांसफर, फोटो और एसएमएस थ्रेड्स को FRE 902 डिजिटल डाइजेस्ट के साथ सुरक्षित करें।',
    es: 'Proteja contratos, transferencias bancarias, fotos y chats SMS con hashes FRE 902 y censura de datos sensibles.',
    de: 'Sichern Sie Mietverträge, Überweisungen, Fotos und SMS-Verläufe mit FRE 902 Digitalzertifikaten und Schwärzungen.',
    fr: 'Sécurisez baux, virements, photos et SMS avec empreintes numériques FRE 902 et caviardage.',
    ja: '契約書、送金明細、現場写真、LINE/SMS履歴を米連邦証拠規則902準拠のデジタル指紋と黒塗り加工で保護。',
    zh: '妥善封存合同文本、银行流水、现场勘验照片及短信记录，生成具备 FRE 902 采信效力的数字摘要并支持隐私涂抹脱敏。'
  },
  tourStep3Tip: {
    en: 'Drop files to compute live SHA-256 hash digests and generate court-ready Exhibit stickers.',
    hi: 'लाइव SHA-256 हैश की गणना करने और अदालत के प्रदर्श स्टिकर बनाने के लिए फ़ाइलें छोड़ें।',
    es: 'Arrastre archivos para calcular hashes SHA-256 al instante y generar pegatinas de Prueba judicial.',
    de: 'Ziehen Sie Dateien hinein, um SHA-256 Prüfsummen und gerichtsfeste Beweisaufkleber zu generieren.',
    fr: 'Déposez vos fichiers pour calculer les empreintes SHA-256 et créer des étiquettes de Pièces.',
    ja: 'ファイルをドラッグ＆ドロップして即座にSHA-256ハッシュを計算し、法廷用「甲第○号証」ラベルを作成。',
    zh: '直接拖拽文件即可秒级计算 SHA-256 存证哈希，并一键加盖法庭标准“证据标贴”。'
  },

  tourStep4Title: {
    en: '3. Official 28-Line Court Pleadings',
    hi: '3. आधिकारिक 28-पंक्ति अदालती दस्तावेज',
    es: '3. Escritos Judiciales de 28 Líneas Numeradas',
    de: '3. Formelle 28-Zeilen-Gerichtsschriftsätze',
    fr: '3. Actes de Procédure Officiels Numérotés',
    ja: '3. 正式な28行番号付き裁判所提出書面',
    zh: '3. 法院标准 28 行格式诉状与公函'
  },
  tourStep4Subtitle: {
    en: 'California Rule 2.105 & Formal Demand Letters',
    hi: 'कैलिफ़ोर्निया नियम 2.105 और औपचारिक मांग पत्र',
    es: 'Regla 2.105 de California y Cartas de Requerimiento',
    de: 'California Rule 2.105 & Formelle Mahnschreiben',
    fr: 'California Rule 2.105 & Mises en Demeure Officielles',
    ja: 'カリフォルニア州規則2.105準拠＆正式催告書',
    zh: '加州民诉第 2.105 规则标准与诉前律师函'
  },
  tourStep4Desc: {
    en: 'Generate numbered 28-line civil complaints, 10-day pre-litigation demand letters with statutory interest, and sworn verification affidavits.',
    hi: 'संख्यांकित 28-पंक्ति की नागरिक शिकायतें, वैधानिक ब्याज के साथ 10-दिवसीय मांग पत्र और हलफनामे उत्पन्न करें।',
    es: 'Genere demandas civiles numeradas de 28 líneas, cartas de reclamación de 10 días con intereses y declaraciones juradas.',
    de: 'Erstellen Sie nummerierte 28-Zeilen-Klagen, 10-Tages-Mahnschreiben mit Verzugszinsen und eidesstattliche Erklärungen.',
    fr: 'Générez assignations civiles numérotées sur 28 lignes, mises en demeure sous 10 jours avec intérêts et attestations sur l’honneur.',
    ja: '行番号付き28行訴状、法定利息を請求する10日間の提訴予告催告書、および宣誓供述書を作成します。',
    zh: '自动导出严格遵循法院 28 行排版标准的民事起诉状、附带法定利息的 10 天通牒催告函及真实性宣誓陈述书。'
  },
  tourStep4Tip: {
    en: 'Click "Print / Save PDF" to produce court-ready filing documents.',
    hi: 'अदालत के लिए तैयार दस्तावेज तैयार करने के लिए "प्रिंट / पीडीएफ सहेजें" पर क्लिक करें।',
    es: 'Haga clic en "Imprimir / Guardar PDF" para obtener documentos listos para radicar en la corte.',
    de: 'Klicken Sie auf "Drucken / PDF speichern", um einreichungsfertige Dokumente zu erhalten.',
    fr: 'Cliquez sur "Imprimer / Enregistrer PDF" pour générer vos actes prêts pour le greffe.',
    ja: '「印刷 / PDF保存」をクリックして、そのまま裁判所に提出可能な書類を出力します。',
    zh: '点击“打印 / 保存为 PDF”即可直接生成可直接递交法庭立案窗口的正式文书。'
  },

  tourStep5Title: {
    en: '4. Demand & Settlement Matrix',
    hi: '4. मांग और समझौता मैट्रिक्स',
    es: '4. Matriz de Requerimiento y Negociación',
    de: '4. Mahnung & Vergleichs-Matrix',
    fr: '4. Matrice de Négociation & Accord',
    ja: '4. 催告と和解交渉マトリクス',
    zh: '4. 索赔与和解博弈谈判矩阵'
  },
  tourStep5Subtitle: {
    en: 'Risk Math & Rule 408 Negotiation',
    hi: 'जोखिम गणित और नियम 408 बातचीत',
    es: 'Matemática de Riesgo y Negociación Regla 408',
    de: 'Risiko-Mathematik & Verhandlungen nach Regel 408',
    fr: 'Calcul de Risque & Négociation Règle 408',
    ja: 'リスク評価算定＆証拠不採用特権下での交渉',
    zh: '诉讼风险数学期望与保密和解策略'
  },
  tourStep5Desc: {
    en: 'Model your trial expected return (EV) after filing fees and time loss. Generate 3-tier settlement brackets and log incoming offers.',
    hi: 'शुल्क और समय के नुकसान के बाद अपने परीक्षण के अपेक्षित रिटर्न (EV) का मॉडल बनाएं।',
    es: 'Calcule el valor esperado (EV) del juicio deduciendo costas y tiempo. Genere rangos de negociación de 3 niveles.',
    de: 'Berechnen Sie den statistischen Erwartungswert (EV) abzüglich Gerichtskosten. Erstellen Sie 3-stufige Vergleichsspannen.',
    fr: 'Modélisez la valeur nette attendue (EV) après frais de justice. Générez des paliers de transaction à 3 niveaux.',
    ja: '裁判費用や時間損失を差し引いた実質期待値（EV）を算出。3段階の和解受諾ラインを策定し相手方の提示額を記録。',
    zh: '精准测算扣除诉讼成本与误工损失后的审判预期收益净值（EV），设定三段和解心理底线并记录对手出价。'
  },
  tourStep5Tip: {
    en: 'Log settlement offers to evaluate whether to settle or proceed to trial.',
    hi: 'समझौता करने या मुकदमा चलाने का मूल्यांकन करने के लिए प्रस्तावों को लॉग करें।',
    es: 'Registre las ofertas recibidas para evaluar si conviene pactar o acudir a juicio.',
    de: 'Protokollieren Sie Angebote, um abzuwägen, ob sich ein Vergleich lohnt.',
    fr: 'Enregistrez les propositions adverses pour décider d’un accord ou du procès.',
    ja: '提示された和解額を記録し、和解に応じるべきか裁判を継続すべきか客観的に判断。',
    zh: '详细记录对方历次和解开价，科学评估见好就收或继续推进庭审的博弈得失。'
  },

  tourStep6Title: {
    en: '5. AI Legal Second Opinion',
    hi: '5. AI कानूनी द्वितीय राय',
    es: '5. Segunda Opinión Legal de IA',
    de: '5. Juristische KI-Zweitmeinung',
    fr: '5. Deuxième Avis Juridique par IA',
    ja: '5. AI法的セカンドオピニオン診断',
    zh: '5. AI 法律专家第二意见评估'
  },
  tourStep6Subtitle: {
    en: 'Objective Merit Grade & Defense Rebuttals',
    hi: 'उद्देश्य योग्यता ग्रेड और बचाव खंडन',
    es: 'Calificación Objetiva de Mérito y Refutación a Defensas',
    de: 'Objektive Erfolgsnote & Entkräftung gegnerischer Einwände',
    fr: 'Note Objective de Solidité & Réfutation des Moyens Adverses',
    ja: '客観的勝訴率レーティング＆相手方抗弁への反論策',
    zh: '客观胜诉等级评定与被告答辩预先破解'
  },
  tourStep6Desc: {
    en: 'Get an objective case audit (Grade A-F, Win Probability %), predicted defense arguments from opposing parties, and statutory counter-citations.',
    hi: 'एक निष्पक्ष केस ऑडिट (ग्रेड A-F, जीत की संभावना %), विरोधी पक्षों के अपेक्षित बचाव तर्क प्राप्त करें।',
    es: 'Obtenga una auditoría objetiva (Grado A-F, % de éxito), argumentos defensivos previsibles y contracitas legales.',
    de: 'Erhalten Sie ein neutrales Fall-Audit (Noten A-F, Gewinnchance in %), prognostizierte Gegeneinwände und Gegenparagraphen.',
    fr: 'Obtenez un audit impartial (Note A-F, % de succès), les arguments attendus de la défense et les contre-arguments.',
    ja: '事件の客観的診断（A〜F評価、勝訴確率％）、相手方が主張してくる可能性の高い抗弁、およびその反駁条文を事前取得。',
    zh: '获取对全案的客观公正审计（A-F级评分、胜诉概率百分比）、对手可能抛出的抗辩陷阱及权威法条反驳要点。'
  },
  tourStep6Tip: {
    en: 'Tick off vulnerability items to boost your calculated trial win probability score.',
    hi: 'अपने परिकलित परीक्षण जीत संभावना स्कोर को बढ़ावा देने के लिए कमजोरियों को दूर करें।',
    es: 'Mitigue los puntos débiles detectados para aumentar su probabilidad estimada de victoria.',
    de: 'Haken Sie behobene Schwachstellen ab, um Ihre berechnete Gewinnchance zu steigern.',
    fr: 'Corrigez les faiblesses signalées pour augmenter vos chances statistiques de gain.',
    ja: '指摘された懸念事項を順次解消していくことで、算出される勝訴確率スコアを高められます。',
    zh: '针对审计提示的案件脆弱要点逐一补充材料，即可显著拉升系统计算出的综合胜诉几率。'
  },

  tourStep7Title: {
    en: '6. Verified Legal Aid & Court Portals',
    hi: '6. सत्यापित कानूनी सहायता और अदालत पोर्टल',
    es: '6. Asistencia Legal Gratuita y Portales Judiciales',
    de: '6. Verifizierte Rechtshilfe & Gerichts-Portale',
    fr: '6. Aide Juridictionnelle & Portails des Tribunaux',
    ja: '6. 認証された無料法律相談・裁判所ポータル',
    zh: '6. 权威认证公益法援与法院自诉通道'
  },
  tourStep7Subtitle: {
    en: 'Connect to Free Real-Life Legal Help',
    hi: 'वास्तविक निःशुल्क कानूनी सहायता से जुड़ें',
    es: 'Conéctese con Ayuda Legal Gratuita Real',
    de: 'Verbindung zu kostenloser juristischer Unterstützung',
    fr: 'Accédez à une Vraie Aide Juridique Gratuite',
    ja: '実際の無料法律相談・公的扶助窓口へアクセス',
    zh: '无缝对接线下免费专业公益法律援助'
  },
  tourStep7Desc: {
    en: 'Direct phone numbers and intake portals for 131+ pro bono legal aid societies, court fee waiver screeners, and small claims advisors.',
    hi: '131+ निःशुल्क कानूनी सहायता समितियों, अदालती शुल्क छूट और सलाहकारों के लिए सीधे फोन नंबर और पोर्टल।',
    es: 'Teléfonos directos y portales de más de 131 sociedades pro bono, exención de costas judiciales y asesores de reclamos.',
    de: 'Direktkontakte zu über 131 Pro-Bono-Rechtshilfeorganisationen, Gerichtskostenbefreiungen und Bürgerberatungen.',
    fr: 'Numéros directs et portails de 131+ sociétés d’aide juridique, simulateur d’aide juridictionnelle et permanences.',
    ja: '全米・全国131以上のプロボノ無料法律相談所、裁判費用免除（In Forma Pauperis）申請ナビへの直通窓口。',
    zh: '收录 131+ 家官方公立法律援助中心、诉讼费减免费用预审工具及小额纠纷法官助理免费答疑直通热线。'
  },
  tourStep7Tip: {
    en: 'Check your eligibility for In Forma Pauperis (100% court fee waiver).',
    hi: 'अदालती शुल्क में 100% छूट (In Forma Pauperis) के लिए अपनी पात्रता जांचें।',
    es: 'Compruebe si califica para beneficio de justicia gratuita (exención del 100% de tasas judiciales).',
    de: 'Prüfen Sie Ihren Anspruch auf vollständige Gerichtskostenbefreiung (Prozesskostenhilfe).',
    fr: 'Vérifiez votre éligibilité à l’aide juridictionnelle totale (prise en charge à 100% des frais).',
    ja: '裁判費用が全額免除される「訴讼救助制度（In Forma Pauperis）」の該当要件を判定してみましょう。',
    zh: '一键自测是否符合“诉讼费全额减免（In Forma Pauperis）”申请资格，让打官司零负担。'
  },

  tourStep8Title: {
    en: '7. Formal Discovery Studio',
    hi: '7. औपचारिक साक्ष्य अनुरोध स्टूडियो',
    es: '7. Estudio Formal de Proposición de Pruebas',
    de: '7. Formelles Beweisaufnahme-Studio',
    fr: '7. Studio de Production & Découverte de Pièces',
    ja: '7. 正式な証拠開示・文書提出請求スタジオ',
    zh: '7. 正式审前证据调查与取证命令工作室'
  },
  tourStep8Subtitle: {
    en: 'Interrogatories, RFPs, Admissions & Subpoenas',
    hi: 'पूछताछ, दस्तावेज मांग और सम्मन',
    es: 'Interrogatorios, Solicitud de Documentos y Citaciones',
    de: 'Beweisanträge, Urkundenanforderung & Zeugenvorladung',
    fr: 'Interrogatoires, Demandes de Documents & Assignations',
    ja: '質問状、文書提出命令、自白要求および第三者召喚状',
    zh: '书面质询、物证勘验、自认请求书与调查令传票'
  },
  tourStep8Desc: {
    en: 'Draft court-captioned discovery requests with automatic 30-day response warning traps and third-party subpoena commands.',
    hi: '30-दिवसीय प्रतिक्रिया चेतावनी जाल और सम्मन आदेशों के साथ साक्ष्य अनुरोध तैयार करें।',
    es: 'Redacte solicitudes formales de prueba con plazos perentorios de 30 días y órdenes de citación a terceros.',
    de: 'Verfassen Sie gerichtliche Auskunftsverlangen mit 30-Tage-Fristen und Vorladungen Dritter.',
    fr: 'Rédigez vos sommations de communiquer des pièces avec avertissement sous 30 jours et citations de tiers.',
    ja: '裁判所表題付きの証拠開示請求書、30日以内の回答を義務付ける督促文、および第三者喚問状を作成。',
    zh: '拟定具备法院抬头的正式调查申请书，内置逾期未答辩即视为自认的 30 天警告条款与第三方调证命令。'
  },
  tourStep8Tip: {
    en: 'Auto-populate standard ROGs, RFPs, and RFAs tailored to your dispute category.',
    hi: 'अपनी विवाद श्रेणी के अनुसार मानक साक्ष्य प्रश्नों को स्वतः भरें।',
    es: 'Autocomplete interrogatorios y requerimientos estándar adaptados a su categoría.',
    de: 'Laden Sie automatisch vorgefertigte Standardfragen für Ihr Rechtsgebiet.',
    fr: 'Pré-remplissez automatiquement les questionnaires types adaptés à votre type de litige.',
    ja: 'あなたの紛争類型に特化した標準質問項目や証拠提出要求をワンクリックで自動展開。',
    zh: '一键自动载入针对您所在纠纷类型专门优化的全套标准质询问题与调证清单。'
  },

  tourStep9Title: {
    en: '8. Courtroom Trial & Hearing Prep',
    hi: '8. अदालती सुनवाई की तैयारी',
    es: '8. Preparación de Vista y Juicio Oral',
    de: '8. Verhandlungstraining & Einwand-Simulator',
    fr: '8. Préparation du Procès & Plaidoirie',
    ja: '8. 法廷弁論・口頭審理シミュレーション',
    zh: '8. 法庭庭审答辩与质证演练中心'
  },
  tourStep9Subtitle: {
    en: 'Objection Simulator & Witness Outlines',
    hi: 'आपत्ति सिम्युलेटर और गवाह रूपरेखा',
    es: 'Simulador de Objeciones y Guión de Testigos',
    de: 'Einwand-Simulator & Zeugen-Leitfäden',
    fr: 'Simulateur d’Objections & Trame de Témoins',
    ja: '異議申し立て訓練＆証人尋問アウトライン',
    zh: '法庭当庭异议模拟器与证人问话提纲'
  },
  tourStep9Desc: {
    en: 'Practice 8 realistic courtroom objection drills with immediate FRE feedback, organize witness outlines, and use the auto-scrolling teleprompter.',
    hi: '8 यथार्थवादी अदालती आपत्तियों का अभ्यास करें, गवाहों को व्यवस्थित करें और टेलीप्रॉम्प्टर का उपयोग करें।',
    es: 'Entrene 8 simulaciones reales de objeción con reglas FRE, organice testigos y use el teleprópter con desplazamiento.',
    de: 'Üben Sie 8 realistische Beweiseinwände mit Echtzeit-Feedback, strukturieren Sie Zeugen und nutzen Sie den Teleprompter.',
    fr: 'Entraînez-vous à 8 objections réalistes avec feedback immédiat, préparez vos témoins et utilisez le téléprompteur.',
    ja: '米連邦証拠規則に準拠した8つの実践的法廷異議申し立てドリル、証人尋問シナリオ、自動スクロール演説提詞器。',
    zh: '实操演练 8 项法庭即席异议答辩、梳理主询问与交叉质证提纲，并借助自动滚动提词器从容发言。'
  },
  tourStep9Tip: {
    en: 'Set your reading WPM speed to rehearse your opening statement smoothly.',
    hi: 'अपने शुरुआती बयान का सुचारू रूप से अभ्यास करने के लिए अपनी गति सेट करें।',
    es: 'Ajuste la velocidad en palabras por minuto para ensayar su alegato inicial con soltura.',
    de: 'Stellen Sie Ihre Lesegeschwindigkeit (WPM) ein, um Ihr Eröffnungsplädoyer flüssig zu proben.',
    fr: 'Réglez votre vitesse de défilement (WPM) pour répéter votre déclaration liminaire.',
    ja: 'スピーチの読上げ速度（WPM）を設定し、冒頭陳述を落ち着いてリハーサルしましょう。',
    zh: '自由设定提词器每分钟语速（WPM），在镜前从容演练您的开庭陈述与辩论发言。'
  },

  tourStep10Title: {
    en: '9. Statute of Limitations Docket',
    hi: '9. परिसीमा अधिनियम डॉकेट',
    es: '9. Calendario de Prescripción Legal',
    de: '9. Verjährungs-Kalender & Fristen-Docket',
    fr: '9. Registre des Délais de Prescription',
    ja: '9. 消滅時効・出訴期限管理ドケット',
    zh: '9. 诉讼时效日历与期限监控预警'
  },
  tourStep10Subtitle: {
    en: 'Deadline Watcher & Tolling Calculator',
    hi: 'समय सीमा पर नजर और स्थगन कैलकुलेटर',
    es: 'Control de Plazos y Calculadora de Suspensión',
    de: 'Fristenwächter & Hemmungsrechner',
    fr: 'Surveillance des Délais & Calcul d’Interruption',
    ja: '期限監視＆時効完成猶予カリキュレーター',
    zh: '起诉截止日防逾期监控与时效中断测算'
  },
  tourStep10Desc: {
    en: 'Never miss a statutory deadline with state-specific SOL countdowns, tolling triggers, and calendar sync (.ics).',
    hi: 'राज्य-विशिष्ट परिसीमा उलटी गिनती और कैलेंडर सिंक (.ics) के साथ कभी भी वैधानिक समय सीमा न चूकें।',
    es: 'No pierda nunca un plazo fatal con la cuenta atrás estatutaria por estado y sincronización (.ics).',
    de: 'Verpassen Sie keine Klagefrist dank bundeslandspezifischer Verjährungsuhr und Kalendersync (.ics).',
    fr: 'Ne laissez jamais passer un délai d’action grâce au compte à rebours légal et export (.ics).',
    ja: '州・地域ごとの時効カウントダウン、時効完成猶予の要件判定、カレンダー連携（.ics）で期限徒過を絶対防止。',
    zh: '精准基于案发地特定法律倒计时起诉最后时限，掌握时效中断抗辩事由，支持一键同步手机日历（.ics）。'
  },
  tourStep10Tip: {
    en: 'Set emergency reminder alerts before the statutory filing window lapses.',
    hi: 'वैधानिक फाइलिंग विंडो समाप्त होने से पहले आपातकालीन अनुस्मारक अलर्ट सेट करें।',
    es: 'Configure alertas de recordatorio antes de que expire el plazo de prescripción.',
    de: 'Richten Sie Erinnerungen ein, bevor das gesetzliche Klagefenster verstreicht.',
    fr: 'Programmez des alertes avant que le délai d’action en justice n’expire.',
    ja: '出訴期限が切れる前に緊急リマインダー通知を設定し、権利消滅を防ぎましょう。',
    zh: '在法定有效起诉窗口关闭前设置多重紧急预警，彻底杜绝因逾期被法庭直接驳回起诉的致命风险。'
  },

  tourStep11Title: {
    en: '10. Service of Process & Skip Trace',
    hi: '10. तामील प्रक्रिया और पता लगाना',
    es: '10. Notificación Judicial y Localización',
    de: '10. Zustellungsdienst & Personensuche',
    fr: '10. Signification & Recherche d’Adresse',
    ja: '10. 送達手続きおよび相手方所在調査',
    zh: '10. 司法送达凭证与逃债对手寻踪'
  },
  tourStep11Subtitle: {
    en: 'Affidavits of Service & Registered Agents',
    hi: 'तामील का हलफनामा और पंजीकृत एजेंट',
    es: 'Actas de Notificación y Agentes Registrados',
    de: 'Zustellungsnachweise & Zustellungsbevollmächtigte',
    fr: 'Attestations de Signification & Domiciliation',
    ja: '送達宣誓供述書＆法人送達受任者の照会',
    zh: '送达宣誓证明与企业法定送达代理人'
  },
  tourStep11Desc: {
    en: 'Lookup California/Delaware corporate registered agents, verify USPS certified mail delivery signatures, and generate proofs of service.',
    hi: 'कॉर्पोरेट पंजीकृत एजेंटों को खोजें, डाक वितरण हस्ताक्षरों को सत्यापित करें और तामील प्रमाण उत्पन्न करें।',
    es: 'Consulte agentes registrados corporativos, verifique firmas postales de entrega y genere pruebas de notificación.',
    de: 'Ermitteln Sie Firmenvertreter, prüfen Sie Postzustellungsurkunden und erstellen Sie Nachweise.',
    fr: 'Identifiez les agents enregistrés d’entreprises, vérifiez les avis de réception et produisez vos preuves.',
    ja: '法人の登記上送達代理人を即座に照会し、配達証明郵便の受領印を検証して適法な送達証明書を作成。',
    zh: '一键穿透查实公司注册代理人、核验挂号信送达签收回执字迹，自动生成法院盖印标准的“已送达证明书”。'
  },
  tourStep11Tip: {
    en: 'Look up the corporate registered agent to ensure legal service is valid.',
    hi: 'कानूनी तामील मान्य है यह सुनिश्चित करने के लिए कॉर्पोरेट पंजीकृत एजेंट को देखें।',
    es: 'Consulte al agente registrado para garantizar que la notificación judicial sea plenamente válida.',
    de: 'Prüfen Sie den Vertretungsberechtigten, um eine wirksame Zustellung zu sichern.',
    fr: 'Recherchez l’agent légal pour garantir la validité irréprochable de votre signification.',
    ja: '法人の送達受任者を照会し、裁判所での送達無効による却下を確実に回避しましょう。',
    zh: '务必查明企业官方备案送达代理人，确保法院传票送达程序严谨合法、无可挑剔。'
  },

  tourStep12Title: {
    en: '11. Plain-English Legalese Decoder',
    hi: '11. सरल भाषा कानूनी अनुवादक',
    es: '11. Decodificador de Jerga Jurídica',
    de: '11. Juristischer Klartext-Übersetzer',
    fr: '11. Décodeur Juridique en Français Courant',
    ja: '11. 難解な法律用語・契約条項の平易翻訳',
    zh: '11. 合同条款与法言法语白话破译器'
  },
  tourStep12Subtitle: {
    en: 'Instant Contract & Demurrer Translator',
    hi: 'तत्काल अनुबंध और कानूनी अनुवादक',
    es: 'Traductor Instantáneo de Contratos y Excepciones',
    de: 'Sofortübersetzer für Verträge & Klageerwiderungen',
    fr: 'Traducteur Instantané de Contrats & Conclusions',
    ja: '契約書条項＆相手方答弁書の即時解読',
    zh: '格式合同霸王条款与答辩状通俗秒译'
  },
  tourStep12Desc: {
    en: 'Paste confusing arbitration clauses, liquidated damages provisions, or demurrer motions to translate them into plain English facts.',
    hi: 'भ्रामक मध्यस्थता खंडों या कानूनी प्रस्तावों को सरल तथ्यों में अनुवाद करने के लिए यहाँ पेस्ट करें।',
    es: 'Pegue cláusulas confusas de arbitraje, daños liquidados o excepciones para traducirlas a hechos comprensibles.',
    de: 'Fügen Sie unklare Schiedsklauseln, Strafversprechen oder Klageabweisungsanträge ein, um sie verständlich zu übersetzen.',
    fr: 'Collez clauses compromissoires complexes, pénalités forfaitaires ou conclusions adverses pour les décrypter.',
    ja: '難解な強制仲裁条項、違約金条項、相手方の却下申立書を貼り付けるだけで、平易な日常語の事実に翻訳。',
    zh: '直接粘贴令人生畏的仲裁协议、违约金扣除霸王条款或对方律师答辩状，秒变一目了然的大白话。'
  },
  tourStep12Tip: {
    en: 'Check whether your lease contains an unenforceable adhesive liability waiver.',
    hi: 'जांचें कि क्या आपके पट्टे में अप्रवर्तनीय दायित्व छूट शामिल है।',
    es: 'Compruebe si su contrato contiene cláusulas abusivas nulas de pleno derecho.',
    de: 'Prüfen Sie, ob Ihr Mietvertrag unwirksame formularmäßige Haftungsausschlüsse enthält.',
    fr: 'Vérifiez si votre bail contient des clauses abusives de non-responsabilité sans valeur juridique.',
    ja: 'あなたの賃貸契約書に、法律上無効となる不当な免責条項が含まれていないかチェック。',
    zh: '快速甄别您的租房合同或交易单据中是否潜藏在法律上依法自始无效的单方免责霸王条款。'
  },

  tourStep13Title: {
    en: '12. Opposing Counsel Dossier',
    hi: '12. विरोधी वकील डॉसियर',
    es: '12. Dossier del Abogado Contrario',
    de: '12. Profil des gegnerischen Anwalts',
    fr: '12. Dossier de l’Avocat Adverse',
    ja: '12. 相手方代理人弁護士の分析調書',
    zh: '12. 对方代理律师大数据背景档案'
  },
  tourStep13Subtitle: {
    en: 'Attorney Intelligence & Settlement Patterns',
    hi: 'वकील की बुद्धिमत्ता और समझौते के तरीके',
    es: 'Inteligencia de Abogados y Patrones de Acuerdo',
    de: 'Anwalts-Recherche & Vergleichsstatistiken',
    fr: 'Renseignements sur l’Avocat & Historique d’Accords',
    ja: '弁護士情報収集＆過去の和解傾向データ',
    zh: '律师办案风格与诉讼和解心理画像'
  },
  tourStep13Desc: {
    en: 'Research opponent law firm hourly rates, aggressive paper-filing tendencies, and early settlement likelihood.',
    hi: 'विरोधी कानून फर्म की दरों, आक्रामक प्रवृत्तियों और जल्दी समझौते की संभावना पर शोध करें।',
    es: 'Investigue tarifas por hora del bufete contrario, agresividad en escritos y probabilidad de acuerdo temprano.',
    de: 'Recherchieren Sie Stundensätze der Gegenseite, Schriftsatzaggressivität und Vergleichsbereitschaft.',
    fr: 'Analysez honoraires horaires du cabinet adverse, agressivité procédurale et propension à transiger tôt.',
    ja: '相手方法律事務所の想定時間単価、書面連発による消耗戦傾向、および早期和解に応じる可能性を分析。',
    zh: '穿透式研判对方律所小时收费费率、是否擅长以“海量文书拖延战术”逼退当事人，以及早期和解概率。'
  },
  tourStep13Tip: {
    en: 'Identify whether opposing counsel typically settles before the first case management conference.',
    hi: 'पहचानें कि क्या विरोधी वकील आम तौर पर पहली अदालत बैठक से पहले समझौता करता है।',
    es: 'Identifique si el letrado contrario suele pactar antes de la primera comparecencia judicial.',
    de: 'Prüfen Sie, ob der gegnerische Anwalt typischerweise vor der ersten Güteverhandlung einlenkt.',
    fr: 'Identifiez si l’avocat adverse transige habituellement avant la première audience de mise en état.',
    ja: '相手方代理人が第1回期日前での和解に応じるタイプかどうかを見極めましょう。',
    zh: '准确把握对方代理人是否通常在第一次案情管理会议（CMC）前就会主动开价和解的办案习惯。'
  },

  tourStep14Title: {
    en: '13. Security Vault & Local Backups',
    hi: '13. सुरक्षा वॉल्ट और स्थानीय बैकअप',
    es: '13. Bóveda de Seguridad y Copias Locales',
    de: '13. Sicherheits-Tresor & Lokale Backups',
    fr: '13. Coffre Sécurisé & Sauvegardes Locales',
    ja: '13. 暗号化保管庫＆ローカルバックアップ',
    zh: '13. 本地安全保险箱与加密备份归档'
  },
  tourStep14Subtitle: {
    en: 'Client-Side Encryption & Anti-Tamper Bundles',
    hi: 'क्लाइंट-साइड एन्क्रिप्शन और एंटी-टैम्पर बंडल',
    es: 'Cifrado en Dispositivo y Paquetes Antimanipulación',
    de: 'Clientseitige Verschlüsselung & Manipulationsschutz',
    fr: 'Chiffrement Local & Fichiers Inaltérables',
    ja: '端末内暗号化＆改ざん防止アーカイブ',
    zh: '纯本地强加密与防篡改取证数据包'
  },
  tourStep14Desc: {
    en: 'All files, evidence, and notes stay strictly encrypted on your local device. Export password-protected .suechef archive backups at any time.',
    hi: 'सभी फाइलें, साक्ष्य और नोट्स केवल आपके स्थानीय डिवाइस पर एन्क्रिप्टेड रहते हैं। किसी भी समय .suechef बैकअप निर्यात करें।',
    es: 'Todos los archivos y pruebas quedan cifrados en su equipo. Exporte copias .suechef protegidas con contraseña.',
    de: 'Alle Akten und Beweise bleiben verschlüsselt auf Ihrem Gerät. Exportieren Sie passwortgeschützte .suechef Archive.',
    fr: 'Tous vos fichiers et preuves restent chiffrés sur votre appareil. Exportez des archives .suechef protégées par mot de passe.',
    ja: 'すべての文書、証拠、メモはお使いの端末内で厳重に暗号化保存。パスワード付き.suechefアーカイブでいつでもバックアップ。',
    zh: '所有案卷、证据与手记均严格加密保存在您当前设备本地。随时导出受高强度密码保护的 .suechef 归档文件。'
  },
  tourStep14Tip: {
    en: 'Export an encrypted backup before transferring between devices.',
    hi: 'डिवाइस के बीच स्थानांतरण करने से पहले एक एन्क्रिप्टेड बैकअप निर्यात करें।',
    es: 'Exporte una copia cifrada antes de transferir su expediente a otro dispositivo.',
    de: 'Erstellen Sie ein verschlüsseltes Backup vor dem Gerätewechsel.',
    fr: 'Exportez une sauvegarde chiffrée avant de transférer vos données sur un autre appareil.',
    ja: '端末の変更やPCへの移行を行う前に、暗号化バックアップを出力しておきましょう。',
    zh: '在更换设备或将案卷共享给合作律师前，请务必先导出一份全量加密备份副本。'
  },

  // Dispute Intake Wizard Categories
  catSecurityDeposit: {
    en: 'Security Deposit Withheld',
    hi: 'सुरक्षा जमा राशि रोकी गई',
    es: 'Fianza de Alquiler Retenida',
    de: 'Mietkaution nicht zurückgezahlt',
    fr: 'Dépôt de Garantie Retenu',
    ja: '敷金・保証金の不当留保',
    zh: '租房押金被无理扣留'
  },
  catSecurityDepositSub: {
    en: 'Landlord kept deposit or failed statutory deadline',
    hi: 'मकान मालिक ने जमा राशि रख ली या कानूनी समय सीमा से चूक गया',
    es: 'El arrendador retuvo la fianza o incumplió el plazo legal',
    de: 'Vermieter behält Kaution ein oder Frist verstrichen',
    fr: 'Le bailleur a gardé la caution ou dépassé le délai légal',
    ja: '家主が敷金を返還しない、または法定返還期日を超過',
    zh: '房东逾期拒退押金或虚构维修开支克扣'
  },
  catSecurityDepositDesc: {
    en: 'Landlord failed to return security deposit within statutory window and failed to provide itemized receipts.',
    hi: 'मकान मालिक कानूनी खिड़की के भीतर सुरक्षा जमा वापस करने में विफल रहा और रसीदें प्रदान करने में विफल रहा।',
    es: 'El propietario no devolvió el depósito dentro del plazo legal ni aportó facturas detalladas.',
    de: 'Vermieter hat Kaution nicht fristgerecht zurückgezahlt und keine Belege vorgelegt.',
    fr: 'Le bailleur n’a pas restitué le dépôt de garantie dans le délai légal sans fournir de justificatifs détaillés.',
    ja: '家主が法定期間内に敷金を返還せず、修繕明細書の提示も怠った。',
    zh: '房东在法定期限内既未返还押金，亦未出具任何合法有效的维修明细发票。'
  },
  catBreachContract: {
    en: 'Unpaid Invoices / Freelance',
    hi: 'अवैतनिक इनवॉइस / फ्रीलांस',
    es: 'Facturas Impagas / Trabajo Autónomo',
    de: 'Unbezahlte Rechnungen / Freelancer',
    fr: 'Factures Impayées / Prestations',
    ja: '業務委託報酬・請求書の未払い',
    zh: '劳务报酬与外包应收账款拖欠'
  },
  catBreachContractSub: {
    en: 'Client or customer failed to pay for completed deliverables',
    hi: 'ग्राहक पूर्ण किए गए कार्यों के लिए भुगतान करने में विफल रहा',
    es: 'El cliente no pagó por los trabajos terminados y entregados',
    de: 'Kunde zahlt für abgenommene Leistungen nicht',
    fr: 'Le client n’a pas réglé les prestations livrées',
    ja: '発注者が納品完了した業務の報酬を支払わない',
    zh: '客户对已交付验收的成果恶意逾期拒不打款'
  },
  catBreachContractDesc: {
    en: 'Completed agreed professional scope and submitted final invoice, but client refused or ignored payment.',
    hi: 'सहमत पेशेवर दायरे को पूरा किया और अंतिम इनवॉइस प्रस्तुत किया, लेकिन ग्राहक ने भुगतान से इनकार कर दिया।',
    es: 'Se completó el trabajo acordado y se envió la factura final, pero el cliente se negó a pagar.',
    de: 'Auftrag vollständig erbracht und Rechnung gestellt, aber Kunde verweigert die Zahlung.',
    fr: 'Prestation réalisée selon le contrat et facture émise, mais le client refuse ou ignore le paiement.',
    ja: '合意された業務範囲を完了し請求書を送付したが、発注者が支払いを拒否または放置。',
    zh: '已按约定完成全部专业工作并提交最终结算账单，但对方以各种借口拒不付款。'
  },
  catConsumerFraud: {
    en: 'Defective Contractor / Remodel',
    hi: 'दोषपूर्ण ठेकेदार / नवीनीकरण',
    es: 'Contratista Defectuoso / Reformas',
    de: 'Pfusch am Bau / Mangelhafte Renovierung',
    fr: 'Malfaçons d’Artisan / Rénovation',
    ja: 'リフォーム工事の施工不良・手抜き',
    zh: '装修施工质量缺陷与偷工减料'
  },
  catConsumerFraudSub: {
    en: 'Contractor abandoned job, caused leaks, or did shoddy work',
    hi: 'ठेकेदार ने काम छोड़ दिया, रिसाव का कारण बना या घटिया काम किया',
    es: 'El contratista abandonó la obra, causó fugas o hizo un mal trabajo',
    de: 'Handwerker hat Baustelle verlassen, Lecks verursacht oder gepfuscht',
    fr: 'L’artisan a abandonné le chantier ou réalisé un travail défectueux',
    ja: '業者が工事を途中で放棄、水漏れや粗雑な手抜き工事が発生',
    zh: '装修队擅自停工烂尾、水路漏水或做工严重粗制滥造'
  },
  catConsumerFraudDesc: {
    en: 'Contractor performed defective remodeling work failing local building codes and abandoned without curing defects.',
    hi: 'ठेकेदार ने घटिया काम किया और दोषों को ठीक किए बिना काम छोड़ दिया।',
    es: 'El contratista realizó obras defectuosas contrarias a normativa y abandonó el trabajo sin reparar los daños.',
    de: 'Der Handwerker erbrachte mangelhafte Arbeiten gegen Bauvorschriften und beseitigte Mängel nicht.',
    fr: 'L’entrepreneur a réalisé des travaux non conformes aux normes et s’est abstenu de réparer les malfaçons.',
    ja: '業者が建築基準に反する粗悪な工事を行い、瑕疵を補修することなく現場を放棄した。',
    zh: '施工方实施了严重违反建筑规范的劣质装修改造，且拒绝进场返工修缮并擅自撤场。'
  },
  catPropertyDamage: {
    en: 'Property / Auto Damage',
    hi: 'संपत्ति / वाहन की क्षति',
    es: 'Daños al Vehículo / Propiedad',
    de: 'Kfz- / Sachschaden',
    fr: 'Dégâts Véhicule / Matériels',
    ja: '車両物損・器物破損',
    zh: '车辆撞损与个人不动产侵权损害'
  },
  catPropertyDamageSub: {
    en: 'Vehicle collision, neighbor tree fall, or property damage',
    hi: 'वाहन की टक्कर, पड़ोसी का पेड़ गिरना या संपत्ति की क्षति',
    es: 'Accidente de tráfico, caída de árbol del vecino o daño material',
    de: 'Autounfall, herabstürzende Bäume oder Sachbeschädigung',
    fr: 'Collision de voiture, chute d’arbre de voisin ou dégât des eaux',
    ja: '交通事故による車両破損、隣家の倒木被害、または財産侵害',
    zh: '交通事故车损、邻里树木倒伏压损或财产侵权侵害'
  },
  catPropertyDamageDesc: {
    en: 'Defendant negligently caused damage to personal vehicle/property and refused to reimburse verified repair quote.',
    hi: 'प्रतिवादी ने लापरवाही से व्यक्तिगत वाहन/संपत्ति को नुकसान पहुँचाया और मरम्मत का भुगतान करने से इनकार कर दिया।',
    es: 'El demandado causó daños por negligencia a su vehículo o propiedad y rechaza pagar el presupuesto.',
    de: 'Der Beklagte beschädigte fahrlässig Ihr Fahrzeug oder Eigentum und verweigert die Reparaturkostenübernahme.',
    fr: 'Le défendeur a causé par négligence des dommages à votre véhicule/bien et refuse de rembourser les réparations.',
    ja: '被告の過失により所有車両または財産が損壊したが、正規の修理見積額の支払いを拒絶。',
    zh: '被告因过失损毁当事人车辆或财产，且拒不按照正规定损维修报价赔付全额损失。'
  },
  catWageTheft: {
    en: 'Unpaid Personal Loan / Debt',
    hi: 'अवैतनिक व्यक्तिगत ऋण / कर्ज',
    es: 'Préstamo Personal Impago / Deuda',
    de: 'Unbezahltes Privatdarlehen / Schulden',
    fr: 'Prêt Personnel Impayé / Dette',
    ja: '個人間借入金・貸金の返済不履行',
    zh: '个人借款逾期拖欠与民间借贷违约'
  },
  catWageTheftSub: {
    en: 'Loaned funds with promise to repay, borrower defaulted',
    hi: 'चुकौती के वादे के साथ धन उधार दिया, कर्जदार चूक गया',
    es: 'Se prestaron fondos con promesa de devolución y el deudor no pagó',
    de: 'Geld mit Rückzahlungsversprechen verliehen, Schuldner zahlt nicht',
    fr: 'Fonds prêtés avec promesse de remboursement, l’emprunteur est défaillant',
    ja: '返済の約束で金銭を貸し付けたが、借主が期限までに返済を怠った',
    zh: '依约出借个人资金，借款人到期后赖账违约不还'
  },
  catWageTheftDesc: {
    en: 'Loaned personal funds under written/electronic repayment agreement; borrower stopped payments and defaulted.',
    hi: 'लिखित/इलेक्ट्रॉनिक समझौते के तहत व्यक्तिगत धन उधार दिया गया; कर्जदार ने भुगतान रोक दिया और चूक गया।',
    es: 'Se prestaron fondos mediante acuerdo escrito o electrónico; el deudor cesó los pagos e incumplió.',
    de: 'Privatdarlehen nach schriftlicher Vereinbarung gewährt; der Schuldner hat die Raten eingestellt.',
    fr: 'Fonds prêtés par accord écrit ou électronique ; l’emprunteur a cessé les paiements et est en défaut.',
    ja: '書面または電子メッセージの合意に基づき貸し付けたが、債務者が返済を停止し債務不履行。',
    zh: '双方存在书面或电子借贷还款协议，借款人逾期中断还款并彻底构成实质性违约。'
  },
  catNegligence: {
    en: 'Consumer Refund Denied',
    hi: 'उपभोक्ता रिफंड अस्वीकार',
    es: 'Reembolso Denegado a Consumidor',
    de: 'Kaufpreis-Rückerstattung verweigert',
    fr: 'Remboursement Consommateur Refusé',
    ja: '購入商品の代金返金拒否',
    zh: '商家拒绝依法无理由退货退款'
  },
  catNegligenceSub: {
    en: 'Merchant refused lawful refund or delivered wrong product',
    hi: 'व्यापारी ने वैध रिफंड से इनकार कर दिया या गलत उत्पाद दिया',
    es: 'El vendedor rechazó un reembolso legal o entregó un producto erróneo',
    de: 'Händler verweigert gesetzliche Rückerstattung oder lieferte Falschware',
    fr: 'Le commerçant a refusé le remboursement légal ou livré un bien non conforme',
    ja: '販売店が正当な返品返金を拒絶、または契約不適合品を納品',
    zh: '商家无理拒不履行法定退款义务或交付严重不符商品'
  },
  catNegligenceDesc: {
    en: 'Merchant delivered defective/non-conforming goods and refused lawful statutory refund upon return.',
    hi: 'व्यापारी ने दोषपूर्ण सामान वितरित किया और कानूनी रिफंड से इनकार कर दिया।',
    es: 'El comerciante entregó productos defectuosos y denegó el reembolso legal tras la devolución.',
    de: 'Der Verkäufer lieferte mangelhafte Ware und verweigerte die gesetzliche Kaufpreiserstattung.',
    fr: 'Le vendeur a livré des biens défectueux et s’est opposé au remboursement légal après renvoi.',
    ja: '販売者が欠陥品を納品し、買主の正当な契約解除および返金請求を不当に拒絶。',
    zh: '商家交付了瑕疵或不合格商品，在当事人依法退货后仍旧恶意推诿拒绝退还货款。'
  },

  // Intake Form
  intakeTitle: {
    en: '30-Second Dispute Intake & Damage Calculator',
    hi: '30-सेकंड विवाद इनटेक और नुकसान कैलकुलेटर',
    es: 'Ingreso de Disputa en 30 Segundos y Calculadora',
    de: '30-Sekunden Fallaufnahme & Schadensrechner',
    fr: 'Saisie de Litige en 30s & Calculateur de Préjudice',
    ja: '30秒で完了する紛争受付＆損害賠償額カリキュレーター',
    zh: '30 秒极速纠纷录入与法定赔偿金试算器'
  },
  intakeSubtitle: {
    en: 'Choose your situation to calculate statutory penalty multipliers and load verified legal standards.',
    hi: 'वैधानिक दंड गुणकों की गणना करने और सत्यापित कानूनी मानकों को लोड करने के लिए अपनी स्थिति चुनें।',
    es: 'Elija su situación para calcular multas legales y cargar normas verificadas.',
    de: 'Wählen Sie Ihren Fall, um gesetzliche Schadenszuschläge und Gesetzesnormen zu laden.',
    fr: 'Choisissez votre cas pour calculer les pénalités légales et charger les normes applicables.',
    ja: '事案を選択して、法定損害倍率を算出し、認証された法的要件を瞬時にロードします。',
    zh: '选择您的争议情境，系统将自动套用法定惩罚性赔偿倍数并精准匹配法律依据。'
  },
  intakeStep1: {
    en: '1. Select Dispute Type',
    hi: '1. विवाद का प्रकार चुनें',
    es: '1. Tipo de Disputa',
    de: '1. Falltyp wählen',
    fr: '1. Type de Litige',
    ja: '1. 紛争類型の選択',
    zh: '1. 选择纠纷案由'
  },
  intakeStep2: {
    en: '2. Parties & Dates',
    hi: '2. पक्षकार और तिथियां',
    es: '2. Partes y Fechas',
    de: '2. Beteiligte & Daten',
    fr: '2. Parties & Dates',
    ja: '2. 当事者と発生日',
    zh: '2. 双方信息与案发时间'
  },
  intakeStep3: {
    en: '3. Damage Calculator',
    hi: '3. नुकसान कैलकुलेटर',
    es: '3. Calculadora de Daños',
    de: '3. Schadensberechnung',
    fr: '3. Calcul du Préjudice',
    ja: '3. 損害額の算定',
    zh: '3. 损失金额试算'
  },
  intakeStep4: {
    en: '4. Generate Case File',
    hi: '4. केस फ़ाइल बनाएं',
    es: '4. Generar Expediente',
    de: '4. Akte erstellen',
    fr: '4. Créer le Dossier',
    ja: '4. 訴訟ファイルの生成',
    zh: '4. 生成诉讼案卷'
  },
  intakeClaimantLabel: {
    en: 'Your Name (Claimant)',
    hi: 'आपका नाम (दावेदार)',
    es: 'Su Nombre (Reclamante)',
    de: 'Ihr Name (Kläger)',
    fr: 'Votre Nom (Demandeur)',
    ja: 'あなたの氏名（請求者）',
    zh: '您的姓名（原告/申请人）'
  },
  intakeOpponentLabel: {
    en: 'Opposing Party / Business Name',
    hi: 'विरोधी पक्ष / व्यवसाय का नाम',
    es: 'Nombre de la Contraparte o Empresa',
    de: 'Name der Gegenseite / Firma',
    fr: 'Nom de la Partie Adverse / Entreprise',
    ja: '相手方の名称 / 法人名',
    zh: '对方当事人姓名 / 企业名称'
  },
  intakeAmountLabel: {
    en: 'Principal Disputed Amount',
    hi: 'मुख्य विवादित राशि',
    es: 'Monto Principal Disputado',
    de: 'Hauptforderung / Streitbetrag',
    fr: 'Montant Principal en Litige',
    ja: '係争中の元本金額',
    zh: '涉案本金 / 争议标的金额'
  },
  intakeDateLabel: {
    en: 'Date Incident Occurred',
    hi: 'घटना की तारीख',
    es: 'Fecha en que Ocurrió el Hecho',
    de: 'Datum des Vorfalls',
    fr: 'Date de l’Événement',
    ja: '事案が発生した日付',
    zh: '纠纷发生或违约之日'
  },
  intakeSummaryLabel: {
    en: 'Brief Factual Summary',
    hi: 'संक्षिप्त तथ्यात्मक सारांश',
    es: 'Breve Resumen de los Hechos',
    de: 'Kurze Sachverhaltsschilderung',
    fr: 'Bref Résumé des Faits',
    ja: '事実関係の簡単な要約',
    zh: '事实与理由简要概述'
  },
  intakeGenerateBtn: {
    en: 'Calculate & Generate Dispute File',
    hi: 'गणना करें और विवाद फ़ाइल बनाएं',
    es: 'Calcular y Generar Expediente de Disputa',
    de: 'Berechnen & Streitakte anlegen',
    fr: 'Calculer & Générer le Dossier de Litige',
    ja: '計算を実行して事件ファイルを生成',
    zh: '开始测算并一键生成案件档案'
  },

  // Claim Kitchen Note Templates
  noteTemplateSignedContract: {
    en: '📝 Signed Contract',
    hi: '📝 हस्ताक्षरित अनुबंध',
    es: '📝 Contrato Firmado',
    de: '📝 Unterzeichneter Vertrag',
    fr: '📝 Contrat Signé',
    ja: '📝 署名捺印済み契約書',
    zh: '📝 双方已签署合同'
  },
  noteTemplateSignedContractText: {
    en: 'Executed written agreement establishing valid obligation.',
    hi: 'वैध दायित्व स्थापित करने वाला निष्पादित लिखित समझौता।',
    es: 'Acuerdo escrito firmado que establece una obligación válida.',
    de: 'Unterzeichnete schriftliche Vereinbarung begründet die Verpflichtung.',
    fr: 'Contrat écrit signé établissant une obligation valable.',
    ja: '当事者間で有効に締結された契約書により、法的義務を証明。',
    zh: '双方合法签署并盖章的协议文本，确立明确违约责任。'
  },
  noteTemplateWireReceipt: {
    en: '💳 Wire / Bank Receipt',
    hi: '💳 बैंक रसीद',
    es: '💳 Recibo Bancario / Transferencia',
    de: '💳 Bankbeleg / Überweisung',
    fr: '💳 Reçu Bancaire / Virement',
    ja: '💳 送金明細・銀行領収書',
    zh: '💳 银行转账流水及电子回单'
  },
  noteTemplateWireReceiptText: {
    en: 'Bank wire / payment confirmation proving transfer of funds.',
    hi: 'धन के हस्तांतरण को साबित करने वाली बैंक रसीद।',
    es: 'Comprobante de pago o transferencia que acredita la entrega de fondos.',
    de: 'Banküberweisungsnachweis belegt den Geldfluss.',
    fr: 'Relevé bancaire ou reçu de virement prouvant le transfert des fonds.',
    ja: '指定口座への金銭支払いを証明する銀行振込票および受領書。',
    zh: '带银行电子印章的资金转账凭证，充分证明已全额付款。'
  },
  noteTemplatePhotos: {
    en: '📸 Condition Photos',
    hi: '📸 स्थिति की तस्वीरें',
    es: '📸 Fotos del Estado',
    de: '📸 Zustandsfotos',
    fr: '📸 Photos de l’État des Lieux',
    ja: '📸 現況写真・証拠画像',
    zh: '📸 现场勘查与受损现状照片'
  },
  noteTemplatePhotosText: {
    en: 'Time-stamped photos demonstrating property condition upon surrender.',
    hi: 'संपत्ति की स्थिति प्रदर्शित करने वाली समय-मुद्रित तस्वीरें।',
    es: 'Fotografías con fecha y hora que demuestran el estado del bien.',
    de: 'Mit Zeitstempel versehene Fotos belegen den Zustand bei Übergabe.',
    fr: 'Photos horodatées démontrant l’état des biens lors de la remise.',
    ja: '物件引渡し時における現況および破損状態を証明するタイムスタンプ付き写真。',
    zh: '带有防篡改拍摄时间水印的高清照片，证明财产受损实际状况。'
  },
  noteTemplateNotice: {
    en: '✉️ Written Notice',
    hi: '✉️ लिखित नोटिस',
    es: '✉️ Notificación Escrita',
    de: '✉️ Schriftliche Mahnung',
    fr: '✉️ Mise en Demeure Écrite',
    ja: '✉️ 内容証明・書面通知',
    zh: '✉️ 书面催告公函与EMS寄送证明'
  },
  noteTemplateNoticeText: {
    en: 'Formal statutory cure notice delivered via certified mail.',
    hi: 'प्रमाणित डाक के माध्यम से दिया गया औपचारिक वैधानिक नोटिस।',
    es: 'Requerimiento formal fehaciente remitido por burofax o correo certificado.',
    de: 'Formelle Mängelrüge oder Mahnung per Einschreiben zugestellt.',
    fr: 'Mise en demeure formelle délivrée par lettre recommandée avec AR.',
    ja: '配達証明付き内容証明郵便により適法に送達された是正催告書。',
    zh: '通过邮政EMS特快专递以书面形式送达对方的限期纠正与还款催告函。'
  },
  noteTemplateClear: {
    en: '🗑️ Clear Sample',
    hi: '🗑️ नमूना साफ़ करें',
    es: '🗑️ Limpiar Ejemplo',
    de: '🗑️ Vorlage leeren',
    fr: '🗑️ Effacer l’Exemple',
    ja: '🗑️ サンプルを消去',
    zh: '🗑️ 清空示例并手写'
  },

  // Pleading Builder Subtabs
  pleadingComplaint: {
    en: 'Formal 28-Line Civil Complaint',
    hi: 'औपचारिक 28-पंक्ति की नागरिक शिकायत',
    es: 'Demanda Civil Formal de 28 Líneas',
    de: 'Formelle 28-Zeilen-Klage',
    fr: 'Assignation Civile en 28 Lignes',
    ja: '正式な28行番号付き民事訴状',
    zh: '法院标准 28 行民事起诉状'
  },
  pleadingDemandLetter: {
    en: '14-Day Pre-Litigation Demand Letter',
    hi: '14-दिवसीय मुकदमा-पूर्व मांग पत्र',
    es: 'Requerimiento Previo de 14 Días',
    de: '14-tägiges vorgerichtliches Mahnschreiben',
    fr: 'Mise en Demeure Sous 14 Jours',
    ja: '14日間の提訴予告・損害賠償請求書',
    zh: '14 天诉前律师通牒公函'
  },
  pleadingVerification: {
    en: 'Sworn Verification Affidavit',
    hi: 'सत्यापित हलफनामा',
    es: 'Declaración Jurada de Verificación',
    de: 'Eidesstattliche Versicherung',
    fr: 'Attestation de Vérité Sous Serment',
    ja: '宣誓真実証明供述書（Affidavit）',
    zh: '真实性法律责任宣誓声明书'
  },
  pleadingCourtPacket: {
    en: 'Complete Court Filing Packet',
    hi: 'पूर्ण अदालती फाइलिंग पैकेट',
    es: 'Expediente Completo para Radicar en Corte',
    de: 'Vollständiges Gerichtseinreichungs-Paket',
    fr: 'Dossier de Dépôt Complet au Greffe',
    ja: '裁判所提出用 完全パッケージ',
    zh: '法院立案全套文书卷宗'
  },

  // Scale Drawer Keys
  scaleDrawerTitle: {
    en: 'Evidentiary Weights Resting on the Scales',
    hi: 'तराजू पर रखे साक्ष्य भार',
    es: 'Pesos Probatorios que Reposan en la Balanza',
    de: 'Beweisgewichte auf den Waagschalen',
    fr: 'Poids Probatoires Reposant sur la Balance',
    ja: '天秤皿に載せられた各証拠の重量',
    zh: '天平托盘上承载的各项法定证据分量'
  },
  scaleDrawerPlaintiffSide: {
    en: 'Plaintiff Side ({count})',
    hi: 'वादी पक्ष ({count})',
    es: 'Lado del Demandante ({count})',
    de: 'Klägerseite ({count})',
    fr: 'Côté Demandeur ({count})',
    ja: '原告側 ({count})',
    zh: '原告举证方 ({count})'
  },
  scaleDrawerDefendantSide: {
    en: 'Defense Side ({count})',
    hi: 'बचाव पक्ष ({count})',
    es: 'Lado de la Defensa ({count})',
    de: 'Beklagtenseite ({count})',
    fr: 'Côté Défense ({count})',
    ja: '被告側 ({count})',
    zh: '被告抗辩方 ({count})'
  },
  scaleDrawerPlaintiffDesc: {
    en: 'Verified documentary evidence & satisfied statutory elements:',
    hi: 'सत्यापित दस्तावेजी साक्ष्य और संतुष्ट वैधानिक तत्व:',
    es: 'Pruebas documentales verificadas y elementos legales satisfechos:',
    de: 'Verifizierte Beweismittel & erfüllte gesetzliche Tatbestände:',
    fr: 'Preuves documentaires vérifiées & éléments légaux réunis :',
    ja: '検証済み書証および立証完了した法定請求要件:',
    zh: '已查证属实的客观书证及已满足的法定构成要件：'
  },
  scaleDrawerDefendantDesc: {
    en: 'Potential defense arguments, notice defects, or statutory offsets:',
    hi: 'संभावित बचाव तर्क, नोटिस दोष, या वैधानिक ऑफसेट:',
    es: 'Posibles argumentos de defensa, defectos de notificación o deducciones legales:',
    de: 'Mögliche Einwände der Gegenseite, Formfehler oder gesetzliche Abzüge:',
    fr: 'Arguments de défense potentiels, vices de forme ou déductions légales :',
    ja: '相手方の予想抗弁・手続上の不備・法的相殺項目:',
    zh: '被告可能提出的抗辩、程序瑕疵警告或法定冲抵扣减项：'
  },
  scaleDrawerTotalMass: {
    en: '+{count} Total Mass',
    hi: '+{count} कुल द्रव्यमान',
    es: '+{count} Masa Total',
    de: '+{count} Gesamtgewicht',
    fr: '+{count} Masse Totale',
    ja: '+{count} 総重量',
    zh: '+{count} 证明力总权重'
  },
  scaleDrawerExhibitsTitle: {
    en: 'Exhibit Locker Items:',
    hi: 'प्रदर्श लॉकर वस्तुएं:',
    es: 'Elementos en Casillero de Pruebas:',
    de: 'Beweismittel im Tresor:',
    fr: 'Pièces du Coffre-fort de Preuves :',
    ja: '保管庫の提出書証リスト:',
    zh: '证据保险箱登记项：'
  },
  scaleDrawerSatisfiedTitle: {
    en: 'Satisfied Legal Elements (Burden Met):',
    hi: 'संतुष्ट कानूनी तत्व (भार पूरा हुआ):',
    es: 'Elementos Legales Satisfechos (Carga Cumplida):',
    de: 'Erfüllte Tatbestandsmerkmale (Beweis erbracht):',
    fr: 'Éléments Juridiques Satisfaits (Preuve Rapportée) :',
    ja: '立証要件充足（立証責任クリア）:',
    zh: '已满足的法定构成要件（举证责任已完成）：'
  },
  scaleDrawerDefectsTitle: {
    en: 'Notice Defect Warnings (Opponent Challenges):',
    hi: 'नोटिस दोष चेतावनियां (विरोधी की आपत्तियां):',
    es: 'Advertencias de Defecto de Notificación (Desafíos del Oponente):',
    de: 'Warnungen zu Formfehlern (Einwände des Gegners):',
    fr: 'Avertissements de Vice de Notification (Contestations Adversaires) :',
    ja: '手続・通知上の欠陥警告（相手方の争点）:',
    zh: '程序送达缺陷警告（对方主要抗辩突破口）：'
  },
  scaleDrawerNoDefects: {
    en: 'No procedural defects or missing notice elements identified for this dispute.',
    hi: 'इस विवाद के लिए कोई प्रक्रियात्मक दोष या छूटे हुए नोटिस तत्व नहीं मिले।',
    es: 'No se identificaron defectos de procedimiento ni notificaciones faltantes para esta disputa.',
    de: 'Keine Verfahrensfehler oder fehlende Fristankündigungen für diesen Fall festgestellt.',
    fr: 'Aucun vice de procédure ni défaut de notification identifié pour ce litige.',
    ja: 'この事件において手続上の不備や通知漏れは検出されていません。',
    zh: '当前案件未检测到程序瑕疵或法定前置通知缺失。'
  },
  scaleDrawerUnsatisfiedTitle: {
    en: 'Unsatisfied Claim Elements (Defendant Rebuttal Vector):',
    hi: 'असंतुष्ट दावा तत्व (प्रतिवादी खंडन वेक्टर):',
    es: 'Elementos de Demanda No Satisfechos (Vector de Refutación del Demandado):',
    de: 'Unerfüllte Anspruchsvoraussetzungen (Angriffsfläche für Gegenseite):',
    fr: 'Éléments de Demande Non Réunis (Angles d’Attaque Adversaires) :',
    ja: '未立証の請求要件（被告側の反論リスク要件）:',
    zh: '尚未充分举证的构成要件（被告反驳抗辩关键点）：'
  },
  scaleDrawerSimPlaintiffAdded: {
    en: '+ {count} simulated evidentiary exhibit(s) added via live weight controls.',
    hi: '+ {count} सिम्युलेटेड साक्ष्य प्रदर्श लाइव वजन नियंत्रण के माध्यम से जोड़े गए।',
    es: '+ {count} prueba(s) simulada(s) agregada(s) mediante controles de peso.',
    de: '+ {count} simulierte(s) Beweisstück(e) über Gewichtsregler hinzugefügt.',
    fr: '+ {count} pièce(s) simulée(s) ajoutée(s) via les curseurs de poids.',
    ja: '+ {count} 件のシミュレーション立証資料を手動で追加中。',
    zh: '+ {count} 项通过微调天平滑块手动添加的模拟事实证据。'
  },
  scaleDrawerSimDefendantAdded: {
    en: '+ {count} simulated defense counter-claim(s) added via live weight controls.',
    hi: '+ {count} सिम्युलेटेड बचाव दावे लाइव वजन नियंत्रण के माध्यम से जोड़े गए।',
    es: '+ {count} contra-reclamo(s) simulado(s) agregado(s) mediante controles de peso.',
    de: '+ {count} simulierte(r) Gegeneinwand/-anspruch über Gewichtsregler hinzugefügt.',
    fr: '+ {count} contre-argument(s) simulé(s) ajouté(s) via les curseurs de poids.',
    ja: '+ {count} 件のシミュレーション抗弁を手動で追加中。',
    zh: '+ {count} 项通过微调天平滑块手动添加的模拟反诉抗辩。'
  },
  scaleDrawerUploadExhibits: {
    en: 'Upload Real Exhibits in Evidence Locker',
    hi: 'साक्ष्य लॉकर में वास्तविक प्रदर्श अपलोड करें',
    es: 'Subir Pruebas Reales en el Casillero',
    de: 'Echte Beweise im Tresor hinterlegen',
    fr: 'Téléverser des Pièces dans le Coffre de Preuves',
    ja: '証拠保管庫に本物の書証・証拠を追加',
    zh: '前往证据保险箱上传真实文件原件'
  },
  scaleDrawerReviewElements: {
    en: 'Review Statutory Elements in Claim Kitchen',
    hi: 'दावा किचन में वैधानिक तत्वों की समीक्षा करें',
    es: 'Revisar Elementos Estatutarios en el Taller',
    de: 'Gesetzliche Merkmale in der Klage-Küche prüfen',
    fr: 'Vérifier les Éléments Légaux dans l’Atelier',
    ja: '請求要件キッチンで法定要件を確認',
    zh: '前往构成要件工坊完善法定诉请要素'
  },
  scaleDrawerPreponderanceRatio: {
    en: 'Preponderance: {p}% vs {d}%',
    hi: 'साक्ष्य संतुलन: {p}% बनाम {d}%',
    es: 'Preponderancia: {p}% frente a {d}%',
    de: 'Beweisüberhang: {p}% zu {d}%',
    fr: 'Prépondérance : {p}% contre {d}%',
    ja: '証拠優勢比率: {p}% 対 {d}%',
    zh: '证据优势对比: {p}% 胜诉面 vs {d}% 风险面'
  },
  scaleDrawerClose: {
    en: 'Close Drawer',
    hi: 'दराज बंद करें',
    es: 'Cerrar Panel',
    de: 'Schließen',
    fr: 'Fermer le Volet',
    ja: '閉じる',
    zh: '关闭明细'
  },
  scaleCustodian: {
    en: 'Custodian: {custodian} • {category}',
    hi: 'अभिरक्षक: {custodian} • {category}',
    es: 'Custodio: {custodian} • {category}',
    de: 'Verwahrer: {custodian} • {category}',
    fr: 'Détenteur : {custodian} • {category}',
    ja: '保管者: {custodian} • {category}',
    zh: '证据保管人: {custodian} • {category}'
  },
  scaleStatute: {
    en: 'Statute: {statute}',
    hi: 'कानून: {statute}',
    es: 'Estatuto: {statute}',
    de: 'Gesetz: {statute}',
    fr: 'Texte : {statute}',
    ja: '準拠法条: {statute}',
    zh: '法定依据: {statute}'
  },
  scaleRequired: {
    en: 'Required: {statute}',
    hi: 'आवश्यक: {statute}',
    es: 'Requerido: {statute}',
    de: 'Erforderlich: {statute}',
    fr: 'Requis : {statute}',
    ja: '立証必要: {statute}',
    zh: '法定构成要求: {statute}'
  },

  // Dispute Blueprint Keys (CaseManagerModal)
  bpDepositTitle: {
    en: 'California Security Deposit Bad Faith',
    hi: 'कैलिफोर्निया सुरक्षा जमा दुर्भावना',
    es: 'Mala Fe en Fianza de Alquiler de California',
    de: 'Böswillige Kautionsunterschlagung Kalifornien',
    fr: 'Mauvaise Foi sur Dépôt de Garantie (Californie)',
    ja: 'カリフォルニア州 敷金不当未返還（悪意の不履行）',
    zh: '加利福尼亚州租房押金恶意扣留索赔'
  },
  bpDepositDesc: {
    en: 'Landlord failed to return or itemize deposit deductions within mandatory 21 calendar days under Cal. Civ. Code § 1950.5(l).',
    hi: 'मकान मालिक कैल. सिव. कोड § 1950.5(l) के तहत अनिवार्य 21 कैलेंडर दिनों के भीतर जमा राशि वापस करने या कटौती का विवरण देने में विफल रहा।',
    es: 'El arrendador no devolvió ni detalló deducciones en 21 días según Cal. Civ. Code § 1950.5(l).',
    de: 'Vermieter hat Kaution nicht innerhalb von 21 Tagen abgerechnet (Cal. Civ. Code § 1950.5(l)).',
    fr: 'Le bailleur n’a pas restitué la caution sous 21 jours selon le Code civil cal. § 1950.5(l).',
    ja: '家主が加州民法1950.5条(l)項に基づく21日間の法定猶予期間内に敷金の返還・明細提示を怠った。',
    zh: '房东未在加州民法典第 1950.5(l) 条规定的 21 个日历日法定期限内退还押金或出具明细。'
  },
  bpDepositDamages: {
    en: '$3,200 Deposit + $6,400 Statutory 2x Penalty',
    hi: '$3,200 जमा + $6,400 वैधानिक 2x जुर्माना',
    es: '$3,200 Fianza + $6,400 Multa Legal 2x',
    de: '$3.200 Kaution + $6.400 Gesetzliche 2x Strafe',
    fr: '$3 200 Caution + $6 400 Pénalité Légale 2x',
    ja: '$3,200 敷金元本 + $6,400 法定2倍加算金',
    zh: '$3,200 押金本金 + $6,400 法定 2 倍惩罚性赔偿'
  },

  bpContractorTitle: {
    en: 'General Contractor Remodel Breach & Defects',
    hi: 'सामान्य ठेकेदार नवीनीकरण उल्लंघन और दोष',
    es: 'Incumplimiento y Defectos de Contratista de Obras',
    de: 'Vertragsbruch & Mängel bei Bauunternehmer',
    fr: 'Rupture Contractuelle & Malfaçons d’Artisan',
    ja: '建設リフォーム業者の債務不履行・施工瑕疵',
    zh: '房屋装修承包商违约弃工与施工质量缺陷'
  },
  bpContractorDesc: {
    en: 'Contractor abandoned home renovation project with defective plumbing and uneven tile work after receiving payments.',
    hi: 'ठेकेदार ने भुगतान प्राप्त करने के बाद दोषपूर्ण नलसाजी और असमान टाइल काम के साथ घर के नवीनीकरण की परियोजना को छोड़ दिया।',
    es: 'El contratista abandonó la reforma con fontanería defectuosa y azulejos torcidos tras cobrar.',
    de: 'Bauunternehmer brach Renovierung nach Zahlungseingang mit mangelhafter Sanitärinstallation ab.',
    fr: 'L’artisan a abandonné la rénovation avec plomberie défectueuse après encaissement.',
    ja: '工事代金受領後、給排水の重大瑕疵とタイル施工不良を残したままリフォーム工事を放棄。',
    zh: '装修承包商在收取进度款后，遗留严重管道渗漏及瓷砖空鼓缺陷并擅自停工烂尾。'
  },
  bpContractorDamages: {
    en: '$12,200 Repair Cost + $1,450 Mitigation',
    hi: '$12,200 मरम्मत लागत + $1,450 शमन',
    es: '$12,200 Coste Reparación + $1,450 Mitigación',
    de: '$12.200 Reparatur + $1.450 Schadensminderung',
    fr: '$12 200 Réparations + $1 450 Atténuation',
    ja: '$12,200 是正工事費用 + $1,450 損害拡大防止費用',
    zh: '$12,200 维修返工费 + $1,450 紧急减损支出'
  },

  bpFreelanceTitle: {
    en: 'Freelance Software Developer Unpaid Invoice (NYC FIFA)',
    hi: 'फ्रीलांस सॉफ्टवेयर डेवलपर अवैतनिक इनवॉइस (NYC FIFA)',
    es: 'Factura Impaga de Desarrollador Freelance (NYC FIFA)',
    de: 'Unbezahlte Freelancer-Entwicklerrechnung (NYC FIFA)',
    fr: 'Facture Développeur Freelance Impayée (NYC FIFA)',
    ja: 'フリーランス開発者への報酬未払い（NYC フリーランス保護法）',
    zh: '独立软件开发者应收账款拖欠（纽约自由职业保护法）'
  },
  bpFreelanceDesc: {
    en: 'Client accepted React web application code into production but refused payment beyond 30 days under NYC Freelance Isn’t Free Act.',
    hi: 'ग्राहक ने कोड स्वीकार किया लेकिन न्यूयॉर्क कानून के तहत 30 दिनों से अधिक समय तक भुगतान से इनकार किया।',
    es: 'Cliente aceptó código React pero se negó a pagar pasados 30 días bajo la ley NYC FIFA.',
    de: 'Kunde übernahm Web-Code in Produktion, verweigerte aber Zahlung über 30 Tage hinaus.',
    fr: 'Le client a mis le code en production mais refuse de payer après 30 jours (loi NYC FIFA).',
    ja: 'クライアントはコードを本番稼働させたにもかかわらず、30日を超えて支払いを拒否。',
    zh: '客户已将前端系统上线商用，但超过 30 天法定清偿期限仍恶意拒不结算尾款。'
  },
  bpFreelanceDamages: {
    en: '$4,200 Unpaid Milestone + $4,200 Double Damages',
    hi: '$4,200 अवैतनिक मील का पत्थर + $4,200 दोहरा नुकसान',
    es: '$4,200 Hito Impago + $4,200 Daños Dobles',
    de: '$4.200 Offene Rechnung + $4.200 Doppelter Schadenersatz',
    fr: '$4 200 Facture Impayée + $4 200 Dommages Doublés',
    ja: '$4,200 未払報酬額 + $4,200 法定2倍損害賠償',
    zh: '$4,200 拖欠里程碑报酬 + $4,200 法定双倍赔偿'
  },

  bpAutoTitle: {
    en: 'Auto Collision & Property Damage Small Claims',
    hi: 'ऑटो टक्कर और संपत्ति क्षति छोटे दावे',
    es: 'Colisión Vehicular y Daños a la Propiedad',
    de: 'Verkehrsunfall & Sachschaden im Kleinverfahren',
    fr: 'Accident de la Route & Dommages Matériels',
    ja: '自動車事故・物損害小額請求',
    zh: '机动车交通事故与车辆财损小额诉讼'
  },
  bpAutoDesc: {
    en: 'Driver ran red light causing collision damage; insurer failed to reimburse full fair market repair value.',
    hi: 'चालक ने लाल बत्ती तोड़ी जिससे टक्कर हुई; बीमाकर्ता मरम्मत मूल्य की भरपाई करने में विफल रहा।',
    es: 'El conductor se saltó un semáforo en rojo; la aseguradora no cubrió el valor justo de reparación.',
    de: 'Fahrer missachtete rote Ampel; Versicherung zahlt nicht die vollen Reparaturkosten.',
    fr: 'Conducteur ayant grillé un feu rouge ; l’assureur refuse le remboursement intégral des réparations.',
    ja: '信号無視による衝突事故。相手方保険会社が正当な市場修理見積額の支払いを拒絶。',
    zh: '肇事车辆闯红灯引发追尾事故；对方责任险保险人未全额足额赔付车辆定损维修费。'
  },
  bpAutoDamages: {
    en: '$5,400 Frame Repair + $800 Rental Loss',
    hi: '$5,400 फ्रेम मरम्मत + $800 रेंटल नुकसान',
    es: '$5,400 Reparación de Chasis + $800 Coche de Sustitución',
    de: '$5.400 Karosserie + $800 Mietwagen',
    fr: '$5 400 Réparation Châssis + $800 Véhicule de Prêt',
    ja: '$5,400 フレーム修理代 + $800 代車費用',
    zh: '$5,400 车身大梁修复费 + $800 替代交通工具租车费'
  },

  bpConsumerTitle: {
    en: 'Consumer Auto Dealer Deceptive Trade Practices (FDUTPA)',
    hi: 'उपभोक्ता ऑटो डीलर भ्रामक व्यापार व्यवहार (FDUTPA)',
    es: 'Prácticas Comerciales Engañosas de Concesionario (FDUTPA)',
    de: 'Täuschung durch Autohändler / Arglistige Fehlinformation (FDUTPA)',
    fr: 'Pratiques Commerciales Trompeuses de Concessionnaire (FDUTPA)',
    ja: '中古車販売店の不当表示・消費者欺罔行為（FDUTPA）',
    zh: '二手车车商隐瞒重大事故车欺诈消费者（FDUTPA）'
  },
  bpConsumerDesc: {
    en: 'Auto dealership deceptively sold salvaged frame-damaged vehicle as "clean title accident-free" in violation of Florida FDUTPA.',
    hi: 'ऑटो डीलरशिप ने धोखे से दुर्घटनाग्रस्त वाहन को "दुर्घटना-मुक्त" के रूप में बेचा।',
    es: 'El concesionario vendió un coche siniestrado como "libre de accidentes" violando la FDUTPA.',
    de: 'Händler verkaufte Unfallwagen täuschend als "unfallfrei" unter Verstoß gegen FDUTPA.',
    fr: 'Concessionnaire ayant vendu un véhicule accidenté comme "zéro sinistre" (violation FDUTPA).',
    ja: '事故全損歴のある車を「修復歴なし・美車」と偽って販売し消費者保護法に違反。',
    zh: '车商蓄意隐瞒重大结构性水泡撞击事故，伪造无事故记录认证报告构成民事欺诈。'
  },
  bpConsumerDamages: {
    en: '$8,500 Diminished Value + $3,300 Penalty/Costs',
    hi: '$8,500 मूल्य में कमी + $3,300 जुर्माना/लागत',
    es: '$8,500 Depreciación + $3,300 Sanción/Costas',
    de: '$8.500 Wertminderung + $3.300 Strafe/Kosten',
    fr: '$8 500 Dépréciation + $3 300 Pénalités/Frais',
    ja: '$8,500 格落ち損害 + $3,300 制裁金・費用',
    zh: '$8,500 车辆贬值损失 + $3,300 惩罚性三倍索赔及维权成本'
  },

  bpAirlineTitle: {
    en: 'Airline Flight Cancellation & Lost Luggage Compensation',
    hi: 'एयरलाइन उड़ान रद्दीकरण और सामान खो जाने का मुआवजा',
    es: 'Compensación por Vuelo Cancelado y Equipaje Perdido',
    de: 'Flugannullierung & Entschädigung für Gepäckverlust',
    fr: 'Indemnisation Annulation de Vol & Bagages Perdus',
    ja: '航空便欠航およびロストバゲージ法定補償請求',
    zh: '航空公司航班非因不可抗力取消及行李灭失法定赔偿'
  },
  bpAirlineDesc: {
    en: 'Carrier cancelled transatlantic flight without statutory notice and refused mandatory meal/hotel care and EU261/DOT delay compensation.',
    hi: 'कैरियर ने बिना सूचना उड़ान रद्द कर दी और अनिवार्य देखभाल व मुआवजे से इनकार कर दिया।',
    es: 'La aerolínea canceló el vuelo sin previo aviso y denegó el reembolso y hotel obligatorio.',
    de: 'Fluggesellschaft strich Flug ohne Vorankündigung und verweigerte Hotel sowie EU261-Ausgleich.',
    fr: 'Compagnie ayant annulé un vol sans préavis et refusé l’indemnisation UE261 et l’hôtel.',
    ja: '事前の法定通知なく国際線を欠航させ、義務付けられている宿泊提供および遅延補償を拒否。',
    zh: '航司临时取消跨国航班且未依法提供食宿安置，并蓄意拒付欧盟 EU261 及民航法定延误赔偿金。'
  },
  bpAirlineDamages: {
    en: '$650 Statutory Cancellation + $1,220 Hotel/Luggage Out-of-Pocket',
    hi: '$650 वैधानिक रद्दीकरण + $1,220 होटल/सामान खर्च',
    es: '$650 Compensación Legal + $1,220 Hotel y Gastos de Equipaje',
    de: '$650 Gesetzliche Entschädigung + $1.220 Hotel-/Gepäckauslagen',
    fr: '$650 Indemnité Légale + $1 220 Hôtel & Frais de Bagages',
    ja: '$650 法定欠航補償金 + $1,220 宿泊費および荷物実費損害',
    zh: '$650 法定取消定额赔偿金 + $1,220 实际酒店住宿及行李重置支出'
  },

  // Home Dashboard Active Dispute Snapshot
  homeEncryptedBadge: {
    en: 'ENCRYPTED & LOCAL',
    hi: 'एन्क्रिप्टेड और स्थानीय',
    es: 'ENCRIPTADO Y LOCAL',
    de: 'VERSCHLÜSSELT & LOKAL',
    fr: 'CHIFFRÉ & LOCAL',
    ja: '完全暗号化・ローカル保管',
    zh: '端到端本地加密'
  },
  homeActiveDisputeSnapshot: {
    en: 'Active Dispute Snapshot',
    hi: 'सक्रिय विवाद स्नैपशॉट',
    es: 'Resumen del Litigio Activo',
    de: 'Übersicht des aktiven Falls',
    fr: 'Aperçu du Litige Actif',
    ja: '現在進行中の事件サマリー',
    zh: '当前正在处理的纠纷概要'
  },
  homeDisputeMatter: {
    en: 'Dispute Matter:',
    hi: 'विवाद मामला:',
    es: 'Asunto en Disputa:',
    de: 'Streitsache:',
    fr: 'Affaire en Cours :',
    ja: '事件名:',
    zh: '案由/事件名称:'
  },
  homePartiesInvolved: {
    en: 'Parties Involved:',
    hi: 'शामिल पक्षकार:',
    es: 'Partes Involucradas:',
    de: 'Beteiligte Parteien:',
    fr: 'Parties Impliquées :',
    ja: '当事者一覧:',
    zh: '双方当事人:'
  },
  homeEditNames: {
    en: 'Edit Names',
    hi: 'नाम संपादित करें',
    es: 'Editar Nombres',
    de: 'Namen ändern',
    fr: 'Modifier les Noms',
    ja: '氏名を編集',
    zh: '修改当事人名称'
  },
  homeYou: {
    en: 'You:',
    hi: 'आप:',
    es: 'Usted:',
    de: 'Sie:',
    fr: 'Vous :',
    ja: 'あなた (原告):',
    zh: '您 (原告):'
  },
  homeVs: {
    en: 'Vs:',
    hi: 'बनाम:',
    es: 'Vs:',
    de: 'Gegen:',
    fr: 'C/:',
    ja: '対 (被告):',
    zh: '相对人 (被告):'
  },
  homeDamagesClaimed: {
    en: 'Damages Claimed',
    hi: 'दावा किया गया नुकसान',
    es: 'Daños Reclamados',
    de: 'Geforderter Schaden',
    fr: 'Dommages Réclamés',
    ja: '請求損害賠償額',
    zh: '主张索赔总额'
  },
  homeMeritScore: {
    en: 'Merit Score',
    hi: 'योग्यता स्कोर',
    es: 'Puntaje de Mérito',
    de: 'Erfolgs-Score',
    fr: 'Score de Bien-fondé',
    ja: '訴訟勝訴見込スコア',
    zh: '诉求法定胜诉评分'
  },
  homeLegalFeesSaved: {
    en: 'Est. Legal Fees Saved: {amount}',
    hi: 'अनुमानित कानूनी फीस की बचत: {amount}',
    es: 'Ahorro Est. en Abogados: {amount}',
    de: 'Geschätzte Anwaltskostenersparnis: {amount}',
    fr: 'Économie d’Avocat Estimée : {amount}',
    ja: '弁護士費用の推定削減額: {amount}',
    zh: '已省去预估律师代理费: {amount}'
  },
  homeStatutoryLimits: {
    en: 'ⓘ Statutory Limits & Court Rules',
    hi: 'ⓘ वैधानिक सीमाएं और अदालत के नियम',
    es: 'ⓘ Límites Legales y Reglas de la Corte',
    de: 'ⓘ Gesetzliche Grenzen & Gerichtsregeln',
    fr: 'ⓘ Plafonds Légaux & Règles du Tribunal',
    ja: 'ⓘ 法定訴額上限および裁判所規則',
    zh: 'ⓘ 法定标的限额与法院规程'
  },
  homeStatutoryLimitsTitle: {
    en: 'Statutory Claim Limits & Filing Deadlines',
    hi: 'वैधानिक दावा सीमाएं और फाइलिंग समय सीमा',
    es: 'Límites Legales de Reclamo y Plazos de Presentación',
    de: 'Gesetzliche Streitwertgrenzen & Klagefristen',
    fr: 'Plafonds Légaux de Demande & Délais de Dépôt',
    ja: '法定請求限度額および出訴期限・手続規則',
    zh: '法定诉讼标的限额与起诉审查时效'
  },
  homeStatutoryLimitsSubtitle: {
    en: 'Verified small claims ceilings, statute of limitations & court rules for your jurisdiction',
    hi: 'आपके अधिकार क्षेत्र के लिए सत्यापित छोटे दावों की सीमाएं, परिसीमा अधिनियम और अदालत के नियम',
    es: 'Límites verificados de reclamos menores, prescripción y reglas judiciales para su jurisdicción',
    de: 'Geprüfte Streitwertgrenzen, Verjährungsfristen und Gerichtsregeln Ihres Gerichtsbezirks',
    fr: 'Plafonds vérifiés de la justice de proximité, prescription et règles pour votre juridiction',
    ja: '管轄地域における小額訴訟限度額、消滅時効期間、および裁判所手続規則',
    zh: '您所在管辖区已核实的小额法庭受理上限、民事诉讼时效及诉讼程序规则'
  },
  homeSmallClaimsMax: {
    en: 'Small Claims Max',
    hi: 'छोटे दावों की अधिकतम सीमा',
    es: 'Máx. Reclamos Menores',
    de: 'Kleinverfahren-Max.',
    fr: 'Plafond Proximité',
    ja: '小額訴訟上限額',
    zh: '小额法庭受案上限'
  },
  homeFilingWindow: {
    en: 'Filing Window',
    hi: 'फाइलिंग विंडो',
    es: 'Plazo de Presentación',
    de: 'Klagefrist',
    fr: 'Délai de Dépôt',
    ja: '出訴可能期間',
    zh: '法定起诉时效期'
  },
  homeStatuteOfLimitations: {
    en: 'Statute of Limitations',
    hi: 'परिसीमा अधिनियम',
    es: 'Plazo de Prescripción',
    de: 'Verjährungsfrist',
    fr: 'Prescription Légale',
    ja: '消滅時効',
    zh: '民事诉讼时效'
  },
  homeCourtRules: {
    en: 'Court Rules',
    hi: 'अदालत के नियम',
    es: 'Reglas de la Corte',
    de: 'Gerichtsordnung',
    fr: 'Règles du Tribunal',
    ja: '法廷規則',
    zh: '法院审判规则'
  },
  homeClose: {
    en: 'Close',
    hi: 'बंद करें',
    es: 'Cerrar',
    de: 'Schließen',
    fr: 'Fermer',
    ja: '閉じる',
    zh: '关闭'
  },
  partiesCleanSuccessToast: {
    en: 'Example placeholders cleared. You now have a clean slate!',
    hi: 'उदाहरण प्लेसहोल्डर हटा दिए गए। अब आपके पास एक साफ स्लेट है!',
    es: 'Marcadores de ejemplo eliminados. ¡Ahora tiene un lienzo limpio!',
    de: 'Beispielplatzhalter entfernt. Sie können nun Ihre eigenen Daten eintragen!',
    fr: 'Exemples effacés. Vous disposez désormais d’un formulaire vierge !',
    ja: 'サンプルの雛形を消去しました。白紙から入力できます！',
    zh: '已成功清空所有示例占位符，您现在可以纯净输入！'
  },
  partiesCustomTitlePlaceholder: {
    en: 'e.g., Doe v. Acme Corporation',
    hi: 'उदा., डो बनाम एक्मे कॉर्पोरेशन',
    es: 'ej., Doe v. Acme Corporation',
    de: 'z.B. Schmidt gegen Acme GmbH',
    fr: 'ex., Dupont c/ Société Acme',
    ja: '例: 田中 対 アクメ株式会社',
    zh: '例如: 张三 诉 先锋实业有限公司'
  },
  intakeCaseGeneratedSuccess: {
    en: 'Dispute File Generated Successfully!',
    hi: 'विवाद फ़ाइल सफलतापूर्वक बनाई गई!',
    es: '¡Expediente de Disputa Generado con Éxito!',
    de: 'Streitfall erfolgreich generiert!',
    fr: 'Dossier de Litige Généré avec Succès !',
    ja: '紛争案件ファイルが正常に生成されました！',
    zh: '民事争议案件案卷已成功生成！'
  },
  intakeGoToKitchen: {
    en: 'Proceed to Claim Kitchen →',
    hi: 'दावा किचन पर जाएं →',
    es: 'Ir al Taller de Reclamos →',
    de: 'Weiter zur Klage-Küche →',
    fr: 'Accéder à l’Atelier de Demande →',
    ja: '請求要件キッチンへ進む →',
    zh: '进入构成要件工坊 →'
  },
  intakeDaysAgo: {
    en: '{days} days ago',
    hi: '{days} दिन पहले',
    es: 'hace {days} días',
    de: 'vor {days} Tagen',
    fr: 'il y a {days} jours',
    ja: '{days} 日前',
    zh: '{days} 天前'
  },
  intakeCalculatedTotal: {
    en: 'Calculated Statutory Claim Total:',
    hi: 'गणना किया गया कुल वैधानिक दावा:',
    es: 'Total Calculado del Reclamo Legal:',
    de: 'Berechneter gesetzlicher Gesamtschaden:',
    fr: 'Montant Total Légal Calculé :',
    ja: '算出された法定損害賠償総額:',
    zh: '法定可主张索赔总额计算结果：'
  },
  intakePrincipalAmount: {
    en: 'Principal Out-of-Pocket Loss',
    hi: 'मूल वास्तविक नुकसान',
    es: 'Pérdida Principal Directa',
    de: 'Tatsächlicher Hauptschaden',
    fr: 'Préjudice Principal Réel',
    ja: '実損害・元本損害額',
    zh: '实际直接经济损失本金'
  },
  intakeStatutoryPenaltyAmt: {
    en: 'Statutory Penalty ({mult}x Bad Faith)',
    hi: 'वैधानिक जुर्माना ({mult}x दुर्भावना)',
    es: 'Multa Legal ({mult}x Mala Fe)',
    de: 'Gesetzliche Strafe ({mult}x Böswilligkeit)',
    fr: 'Pénalité Légale ({mult}x Mauvaise Foi)',
    ja: '法定加算制裁金 ({mult}倍 悪質不履行)',
    zh: '法定惩罚性赔偿 ({mult} 倍恶意抗辩)'
  },
  intakeAccruedInterest: {
    en: 'Accrued Statutory Interest ({rate}% per annum)',
    hi: 'अर्जित वैधानिक ब्याज ({rate}% प्रति वर्ष)',
    es: 'Intereses Legales Devengados ({rate}% anual)',
    de: 'Aufgelaufene gesetzliche Zinsen ({rate}% p.a.)',
    fr: 'Intérêts Légaux Courus ({rate}% par an)',
    ja: '法定遅延損害金・利息 (年率 {rate}%)',
    zh: '依法计收法定延误利息 (年化 {rate}%)'
  },
  intakeWithinLimit: {
    en: 'Within Small Claims Limit ({symbol}{limit})',
    hi: 'छोटे दावों की सीमा के भीतर ({symbol}{limit})',
    es: 'Dentro del Límite de Reclamos Menores ({symbol}{limit})',
    de: 'Innerhalb der Kleinverfahren-Grenze ({symbol}{limit})',
    fr: 'Sous le Plafond de Proximité ({symbol}{limit})',
    ja: '小額訴訟の管轄上限内 ({symbol}{limit})',
    zh: '完全处于小额法庭受案限额内 ({symbol}{limit})'
  },
  intakeExceedsLimit: {
    en: 'Exceeds Small Claims Limit ({symbol}{limit}) — Consider Civil Limited',
    hi: 'छोटे दावों की सीमा से अधिक ({symbol}{limit}) — सीमित दीवानी पर विचार करें',
    es: 'Supera el Límite Menor ({symbol}{limit}) — Considere Civil Limitado',
    de: 'Übersteigt Streitwertgrenze ({symbol}{limit}) — Zivilgerichtliche Klage erforderlich',
    fr: 'Dépasse le Plafond ({symbol}{limit}) — Envisager Juridiction Ordinaire',
    ja: '小額訴訟上限超過 ({symbol}{limit}) — 通常訴訟への移行を検討',
    zh: '超出小额法庭限额 ({symbol}{limit}) — 建议选择普通基层民事审理'
  },
  tourTip: {
    en: 'Tip',
    hi: 'सुझाव',
    es: 'Consejo',
    de: 'Tipp',
    fr: 'Conseil',
    ja: 'ヒント',
    zh: '提示'
  },
  closeEsc: {
    en: 'Close (Esc)',
    hi: 'बंद करें (Esc)',
    es: 'Cerrar (Esc)',
    de: 'Schließen (Esc)',
    fr: 'Fermer (Échap)',
    ja: '閉じる (Esc)',
    zh: '关闭 (Esc)'
  },
  homeSwitchDispute: {
    en: 'Switch / New Dispute',
    hi: 'विवाद बदलें / नया बनाएं',
    es: 'Cambiar / Nuevo Litigio',
    de: 'Verfahren wechseln / Neu',
    fr: 'Changer / Nouveau Dossier',
    ja: '事件切替・新規作成',
    zh: '切换案件 / 新建争议'
  },
  homePopularEverydayDisputes: {
    en: 'POPULAR EVERYDAY DISPUTES',
    hi: 'लोकप्रिय रोजमर्रा के विवाद',
    es: 'DISPUTAS COTIDIANAS POPULARES',
    de: 'HÄUFIGE ALLTAGSKONFLIKTE',
    fr: 'LITIGES COURANTS DU QUOTIDIEN',
    ja: 'よくある日常の法的紛争',
    zh: '常见民事纠纷争议'
  },
  homeWorkstationsTitle: {
    en: 'Litigation Workstations (6-Step Preparation)',
    hi: 'मुकदमेबाजी वर्कस्टेशन (6-चरणीय तैयारी)',
    es: 'Estaciones de Litigio (Preparación en 6 Pasos)',
    de: 'Rechtsarbeitsplätze (6-Schritte-Vorbereitung)',
    fr: 'Postes de Travail du Litige (Préparation en 6 Étapes)',
    ja: '訴訟ワークステーション（6段階の準備）',
    zh: '诉讼工作台（6 步案件准备流程）'
  },
  homeWorkstationsSubtitle: {
    en: 'Follow these clear, sequential steps to prepare evidence, draft compliant pleadings, and calculate your legal second opinion.',
    hi: 'साक्ष्य तैयार करने, कानूनी दस्तावेज का मसौदा तैयार करने और अपनी कानूनी दूसरी राय की गणना करने के लिए इन स्पष्ट चरणों का पालन करें।',
    es: 'Siga estos pasos secuenciales para preparar pruebas, redactar escritos conformes y calcular su segunda opinión legal.',
    de: 'Befolgen Sie diese klaren Schritte zur Beweissicherung, Schriftsatzerstellung und Berechnung Ihrer juristischen Zweitmeinung.',
    fr: 'Suivez ces étapes claires pour préparer vos preuves, rédiger des actes conformes et obtenir votre deuxième avis juridique.',
    ja: '証拠の収集・整理、裁判規範に準拠した訴状の起草、法的セカンドオピニオンの算出まで順序立てて進められます。',
    zh: '循序渐进整理关键证据、撰写符合规范的法庭诉状，并获取客观权威的法律第二意见评估。'
  },
  homeOpenClaimKitchen: {
    en: 'Open Claim Kitchen',
    hi: 'दावा किचन खोलें',
    es: 'Abrir Armado de Caso',
    de: 'Klage-Küche öffnen',
    fr: 'Ouvrir Montage Dossier',
    ja: '主張構築を開く',
    zh: '进入诉求工作台'
  },
  homeOpenEvidenceLocker: {
    en: 'Open Evidence Locker',
    hi: 'साक्ष्य लॉकर खोलें',
    es: 'Abrir Casillero de Pruebas',
    de: 'Beweistresor öffnen',
    fr: 'Ouvrir Coffre de Preuves',
    ja: '証拠ロッカーを開く',
    zh: '进入证据保管库'
  },
  homeOpenDocumentDrafter: {
    en: 'Open Document Drafter',
    hi: 'दस्तावेज़ ड्राफ्टर खोलें',
    es: 'Abrir Redactor de Escritos',
    de: 'Schriftsatz-Editor öffnen',
    fr: 'Ouvrir Rédacteur d’Actes',
    ja: '訴状ドラフトを開く',
    zh: '进入文书起草台'
  },
  homeOpenSettlementMatrix: {
    en: 'Open Settlement Matrix',
    hi: 'समझौता मैट्रिक्स खोलें',
    es: 'Abrir Matriz de Acuerdo',
    de: 'Vergleichsmatrix öffnen',
    fr: 'Ouvrir Matrice d’Accord',
    ja: '和解交渉マトリクスを開く',
    zh: '进入和解谈判测算'
  },
  homeRunSecondOpinion: {
    en: 'Run Second Opinion Audit',
    hi: 'दूसरी राय ऑडिट चलाएं',
    es: 'Auditar Segunda Opinión',
    de: 'Zweitmeinungs-Audit starten',
    fr: 'Lancer Deuxième Avis',
    ja: 'セカンドオピニオン診断を実行',
    zh: '运行第二意见评估'
  },
  homeFindRealLifeHelp: {
    en: 'Find Real-Life Help',
    hi: 'वास्तविक कानूनी सहायता खोजें',
    es: 'Buscar Asistencia Real',
    de: 'Rechtshilfe finden',
    fr: 'Trouver de l’Aide Réelle',
    ja: '実際の公的支援を探す',
    zh: '查找线下法律援助'
  },
  homeRealWorldBlueprints: {
    en: 'Real-World Dispute Blueprints',
    hi: 'वास्तविक दुनिया के विवाद ब्लूप्रिंट',
    es: 'Modelos de Litigios Reales',
    de: 'Praxiserprobte Fall-Blaupausen',
    fr: 'Modèles de Litiges Concrets',
    ja: '実践的紛争ブループリント',
    zh: '真实典型纠纷蓝图'
  },
  homeBlueprintsSubtitle: {
    en: 'Select a pre-calibrated dispute blueprint to automatically load verified legal elements, damage math, and sample evidence.',
    hi: 'सत्यापित कानूनी तत्वों, क्षति गणना और नमूना साक्ष्य को स्वचालित रूप से लोड करने के लिए एक पूर्व-कैलिब्रेटेड विवाद ब्लूप्रिंट चुनें।',
    es: 'Seleccione un modelo precalibrado para cargar automáticamente fundamentos jurídicos, cálculo de daños y pruebas tipo.',
    de: 'Wählen Sie eine vorkonfigurierte Fall-Blaupause, um Tatbestandsmerkmale, Schadensberechnungen und Musterbeweise zu laden.',
    fr: 'Sélectionnez un modèle préconfiguré pour charger automatiquement les éléments juridiques, le calcul des dommages et des preuves types.',
    ja: '検証済みの法的要件、損害算定式、証拠サンプルを1タップで自動展開します。',
    zh: '一键载入针对特定争议预置的法定构成要件、索赔计算公式与示范举证要目。'
  },
  homeLoadBlueprintStart: {
    en: 'Load Blueprint & Start',
    hi: 'ब्लूप्रिंट लोड करें और शुरू करें',
    es: 'Cargar Modelo e Iniciar',
    de: 'Blaupause laden & Starten',
    fr: 'Charger Modèle & Démarrer',
    ja: 'ブループリントを適用して開始',
    zh: '载入蓝图并开始'
  },
  homeDisclaimerTitle: {
    en: 'Important Legal Disclaimer & Self-Help Notice',
    hi: 'महत्वपूर्ण कानूनी अस्वीकरण और स्व-सहायता सूचना',
    es: 'Aviso Legal Importante y Notificación de Autogestión',
    de: 'Wichtiger rechtlicher Hinweis & Selbsthilfe-Information',
    fr: 'Avis Juridique Important & Information d’Auto-Assistance',
    ja: '重要：法的免責事項および自己代理支援について',
    zh: '重要法律免责声明与自行诉讼辅助指引'
  },
  homeDisclaimerBadge: {
    en: 'Not a Substitute for an Attorney',
    hi: 'वकील का विकल्प नहीं',
    es: 'No Sustituye a un Abogado',
    de: 'Kein Ersatz für einen Anwalt',
    fr: 'Ne Remplace Pas un Avocat',
    ja: '弁護士の代替ではありません',
    zh: '不可替代执业律师专业代理'
  },
  homeDisclaimerP1: {
    en: 'SueChef is a legal technology self-help workflow tool designed to assist self-represented (pro se) claimants in organizing evidence, calculating statutory damage formulas, and structuring court-compliant paperwork. SueChef is not a law firm, does not provide formal legal representation or tailored legal advice, and does not establish an attorney-client relationship.',
    hi: 'SueChef एक कानूनी तकनीक स्व-सहायता टूल है जिसे स्वयं का प्रतिनिधित्व करने वाले दावेदारों को साक्ष्य व्यवस्थित करने, वैधानिक क्षति सूत्रों की गणना करने और अदालत के अनुरूप कागजी कार्रवाई तैयार करने में सहायता के लिए डिज़ाइन किया गया है। SueChef कोई लॉ फर्म नहीं है और वकील-मुवक्किल संबंध स्थापित नहीं करता है।',
    es: 'SueChef es una herramienta tecnológica de autogestión jurídica diseñada para ayudar a demandantes que se autorrepresentan a ordenar pruebas, calcular indemnizaciones legales y estructurar escritos judiciales. SueChef no es un bufete de abogados ni establece una relación abogado-cliente.',
    de: 'SueChef ist ein juristisches Selbsthilfe-Werkzeug, das Parteien ohne Anwalt dabei unterstützt, Beweise zu strukturieren, gesetzliche Schadensersatzansprüche zu berechnen und formgerechte Schriftsätze zu erstellen. SueChef ist keine Kanzlei und begründet kein Mandatsverhältnis.',
    fr: 'SueChef est un outil technologique d’auto-assistance juridique conçu pour aider les justiciables assurant leur propre défense à structurer leurs preuves, calculer leurs dommages-intérêts et mettre en forme leurs écritures. SueChef n’est pas un cabinet d’avocats et ne crée aucune relation avocat-client.',
    ja: 'SueChefは本人訴訟（プロ・セ）当事者を支援し、証拠の整理、法定賠償額の算定、裁判規範準拠の書面作成を効率化するための法務支援ツールです。法律事務所ではなく、個別の弁護士・依頼者関係を創設するものではありません。',
    zh: 'SueChef 是一款法律科技自行诉讼辅助工具，旨在协助当事人梳理证据链条、核算法定赔偿公式并规范撰写起诉文书。本工具非律师事务所，不构成为特定个案提供正式代理的委托聘用关系。'
  },
  homeDisclaimerP2: {
    en: 'All statutory multipliers, interest rates, and procedural checklists are derived from publicly accessible state civil codes and court rules. Actual legal results depend on individual case facts, local court local rules, and judicial discretion. If you require legal counsel, representation in court, or advice regarding complex legal strategies, please consult a licensed attorney in your jurisdiction or utilize our Verified Legal Aid Directory.',
    hi: 'सभी वैधानिक गुणक, ब्याज दरें और प्रक्रियात्मक चेकलिस्ट सार्वजनिक रूप से सुलभ नागरिक संहिताओं से प्राप्त किए गए हैं। वास्तविक कानूनी परिणाम व्यक्तिगत मामले के तथ्यों और न्यायिक विवेक पर निर्भर करते हैं। यदि आपको जटिल कानूनी रणनीतियों के लिए सलाह की आवश्यकता है, तो कृपया किसी लाइसेंस प्राप्त वकील से परामर्श लें।',
    es: 'Todos los multiplicadores legales, tipos de interés y listas de control procesales proceden de códigos civiles y normativas procesales públicas. El resultado depende de los hechos y del criterio judicial. Si precisa representación o asesoramiento sobre estrategias complejas, consulte a un abogado colegiado.',
    de: 'Alle gesetzlichen Multiplikatoren, Verzugszinsen und Checklisten basieren auf öffentlich zugänglichen Zivilgesetzen. Die tatsächliche Entscheidung hängt vom Einzelfall und dem richterlichen Ermessen ab. Bei komplexen Streitfragen konsultieren Sie bitte einen zugelassenen Rechtsanwalt.',
    fr: 'Tous les multiplicateurs légaux, taux d’intérêt et listes de contrôle sont issus des codes civils et règles de procédure publics. L’issue dépend des faits de l’espèce et de l’appréciation souveraine du juge. Pour toute stratégie complexe, veuillez consulter un avocat inscrit au barreau.',
    ja: '表示される法定利率、賠償倍率、手続要件は公開されている民事法規に基づきます。実際の司法判断は個別の事実関係および裁判官の裁量に委ねられます。複雑な法的判断を要する場合は、管轄地域の弁護士または公的法律相談窓口をご利用ください。',
    zh: '所有法定倍数、利息费率及程序审查清单均基于公开现行民事法规提炼。具体判决结果取决于个案客观事实与法官自由裁量。如涉及重大利益或复杂疑难争议，请咨询执业律师或前往法律援助中心。'
  },
  homeLimitsModalTitle: {
    en: '{jurisdiction} Court Rules & Limits',
    hi: '{jurisdiction} अदालत के नियम और सीमाएं',
    es: 'Normas y Límites de la Corte en {jurisdiction}',
    de: 'Gerichtsregeln & Streitwertgrenzen ({jurisdiction})',
    fr: 'Règles et Plafonds de Juridiction ({jurisdiction})',
    ja: '{jurisdiction} 裁判所の管轄上限と訴訟規程',
    zh: '{jurisdiction} 法院诉讼规则与标的限额'
  },
  homeLimitsModalSub: {
    en: 'Jurisdictional Thresholds & Statutory Deadlines',
    hi: 'अधिकार क्षेत्र की सीमाएं और वैधानिक समय सीमाएं',
    es: 'Límites de Jurisdicción y Plazos Legales',
    de: 'Streitwertgrenzen & Gesetzliche Fristen',
    fr: 'Seuils de Compétence & Délais de Prescription',
    ja: '事物管轄の上限額および法定消滅時効',
    zh: '受案标的管辖门槛与诉讼时效期限'
  },
  homeIndividualClaimCeiling: {
    en: 'Individual Claim Ceiling',
    hi: 'व्यक्तिगत दावे की अधिकतम सीमा',
    es: 'Límite Individual de Reclamo',
    de: 'Streitwert-Obergrenze',
    fr: 'Plafond des Demandes Individuelles',
    ja: '個人請求の管轄上限額',
    zh: '个人索赔受理上限'
  },
  homeMaxRecoverableSmallClaims: {
    en: 'Maximum recoverable in small claims',
    hi: 'छोटे दावों में अधिकतम वसूली योग्य',
    es: 'Importe máximo exigible en juzgado de reclamos menores',
    de: 'Maximaler Betrag im vereinfachten Verfahren',
    fr: 'Montant maximum indemnisable devant le tribunal de proximité',
    ja: '小額裁判手続で請求可能な上限額',
    zh: '小额诉讼程序最高索赔限额'
  },
  homeAttorneyRepresentation: {
    en: 'Attorney Representation',
    hi: 'वकील का प्रतिनिधित्व',
    es: 'Representación por Abogado',
    de: 'Anwaltsvertretung',
    fr: 'Représentation par Avocat',
    ja: '弁護士代理の可否',
    zh: '执业律师代理权'
  },
  homeAttorneysPermitted: {
    en: 'Permitted',
    hi: 'अनुमति प्राप्त',
    es: 'Permitida',
    de: 'Zulässig',
    fr: 'Autorisée',
    ja: '代理人選任可',
    zh: '允许律师代理'
  },
  homeAttorneysBarred: {
    en: 'Barred (Pro Se Only)',
    hi: 'प्रतिबंधित (केवल स्वयं प्रतिनिधित्व)',
    es: 'Prohibida (Sólo Autogestión)',
    de: 'Ausgeschlossen (Nur Parteivertretung)',
    fr: 'Exclue (Comparution Personnelle)',
    ja: '弁護士選任制限（本人出頭原則）',
    zh: '限制代理（当事人本人亲自出庭）'
  },
  homeAttorneysPermittedSub: {
    en: 'Parties may retain counsel',
    hi: 'पक्षकार वकील रख सकते हैं',
    es: 'Las partes pueden designar letrado',
    de: 'Parteien dürfen Anwälte beauftragen',
    fr: 'Les parties peuvent se faire assister d’un avocat',
    ja: '双方が代理人弁護士を立てることができます',
    zh: '双方当事人均可依法聘请委托诉讼代理人'
  },
  homeAttorneysBarredSub: {
    en: 'Self-representation required by law',
    hi: 'कानून द्वारा स्वयं प्रतिनिधित्व अनिवार्य',
    es: 'La ley exige la comparecencia personal',
    de: 'Gesetzlich vorgeschriebenes persönliches Auftreten',
    fr: 'La loi impose la représentation par soi-même',
    ja: '原則として本人同士が対席審理に臨みます',
    zh: '法规强制要求当事人亲自陈述答辩'
  },
  homeCommonStatutoryDeadlines: {
    en: 'Common Statutory Deadlines (Statute of Limitations):',
    hi: 'सामान्य वैधानिक समय सीमाएं (सीमा कानून):',
    es: 'Plazos de Prescripción Comunes:',
    de: 'Wichtige gesetzliche Verjährungsfristen:',
    fr: 'Délais de Prescription Habituels :',
    ja: '主な法定消滅時効・出訴期限：',
    zh: '常见民事诉讼时效法定起诉期限：'
  },
  homeWrittenContract: {
    en: 'Written Contract',
    hi: 'लिखित अनुबंध',
    es: 'Contrato Escrito',
    de: 'Schriftlicher Vertrag',
    fr: 'Contrat Écrit',
    ja: '書面による契約',
    zh: '书面正式合同'
  },
  homeOralContract: {
    en: 'Oral Contract',
    hi: 'मौखिक अनुबंध',
    es: 'Contrato Verbal',
    de: 'Mündlicher Vertrag',
    fr: 'Contrat Verbal',
    ja: '口頭契約・合意',
    zh: '口头约定协议'
  },
  homePropertyDamageLimit: {
    en: 'Property Damage',
    hi: 'संपत्ति का नुकसान',
    es: 'Daños a la Propiedad',
    de: 'Sachschaden',
    fr: 'Dommages aux Biens',
    ja: '物損・財産損害',
    zh: '财产侵害赔偿'
  },
  homeYears: {
    en: '{count} Years',
    hi: '{count} वर्ष',
    es: '{count} Años',
    de: '{count} Jahre',
    fr: '{count} Ans',
    ja: '{count}年',
    zh: '{count}年'
  },
  homeFeeWaiverNoticeTitle: {
    en: 'Court Filing Fee Waiver Notice (In Forma Pauperis):',
    hi: 'अदालत शुल्क छूट सूचना (In Forma Pauperis):',
    es: 'Exención de Tasas Judiciales (In Forma Pauperis):',
    de: 'Prozesskostenhilfe / Gebührenbefreiung (In Forma Pauperis):',
    fr: 'Demande d’Aide Juridictionnelle (In Forma Pauperis) :',
    ja: '訴訟費用免除申請（イン・フォルマ・パウペリス）：',
    zh: '诉讼费用减免及司法救助申请须知（In Forma Pauperis）：'
  },
  homeFeeWaiverNoticeDesc: {
    en: 'If you are low-income or receive public assistance (SNAP, SSI, Medicaid), you may request a 100% waiver of court filing and service fees by filing Form FW-001 with the court clerk.',
    hi: 'यदि आपकी आय कम है या आप सार्वजनिक सहायता प्राप्त करते हैं, तो आप अदालत के क्लर्क के साथ फॉर्म FW-001 दाखिल करके अदालत शुल्क में 100% छूट का अनुरोध कर सकते हैं।',
    es: 'Si tiene bajos ingresos o recibe asistencia social, puede solicitar la exención total del 100% de tasas judiciales y costes de notificación presentando el formulario ante el juzgado.',
    de: 'Bei geringem Einkommen oder Bezug staatlicher Hilfen können Sie bei der Geschäftsstelle einen Antrag auf vollständige Gebührenbefreiung (Prozesskostenhilfe) stellen.',
    fr: 'Si vous avez de faibles revenus ou percevez des aides sociales, vous pouvez demander une prise en charge à 100% des frais de justice et de signification.',
    ja: '低所得世帯または公的扶助受給者の場合、裁判所書記官窓口にて申立手数料および送達費用の全額免除申請を行うことができます。',
    zh: '如经济确有困难或领取政府社会救济补助，可在立案时向法庭书记员申请 100% 减免案件受理费与司法送达费。'
  },
  homeUnderstoodClose: {
    en: 'Understood & Close',
    hi: 'समझ लिया और बंद करें',
    es: 'Entendido y Cerrar',
    de: 'Verstanden & Schließen',
    fr: 'Compris & Fermer',
    ja: '確認して閉じる',
    zh: '已阅读并关闭'
  },
  pipelineTitle: {
    en: 'Litigation Pipeline & Lifecycle Status',
    hi: 'मुकदमेबाजी पाइपलाइन और स्थिति',
    es: 'Canal de Litigio y Fases del Proceso',
    de: 'Verfahrensphasen & Lebenszyklus',
    fr: 'Pipeline du Litige & Statut du Dossier',
    ja: '紛争解決パイプライン・進捗ステータス',
    zh: '诉讼全生命周期管理流转看板'
  },
  pipelineDesc: {
    en: 'Track your dispute from initial incident intake to formal enforcement and recovery.',
    hi: 'शुरुआती घटना इनटेक से लेकर औपचारिक प्रवर्तन और वसूली तक अपने विवाद को ट्रैक करें।',
    es: 'Supervise su litigio desde la reclamación inicial hasta la ejecución forzosa y el cobro.',
    de: 'Verfolgen Sie Ihren Rechtsstreit von der Erstaufnahme bis zur Zwangsvollstreckung.',
    fr: 'Suivez votre dossier de la mise en demeure initiale jusqu’à l’exécution forcée.',
    ja: '最初の被害相談から正式な強制執行・回収まで、全手続を段階的に追跡します。',
    zh: '全流程跟踪纠纷推进：从初始侵权取证、催告交涉直至判决执行回款。'
  },
  stageIntake: {
    en: 'Claim Intake',
    hi: 'दावा इनटेक',
    es: 'Recepción del Reclamo',
    de: 'Fallaufnahme',
    fr: 'Prise en Charge',
    ja: '主張受付',
    zh: '立案录入'
  },
  stageIntakeDesc: {
    en: 'Document facts, itemize losses & verify legal elements.',
    hi: 'तथ्यों को दस्तावेज करें, नुकसानों का विवरण दें और कानूनी तत्वों को सत्यापित करें।',
    es: 'Documentar hechos, desglosar pérdidas y verificar fundamentos.',
    de: 'Sachverhalt erfassen, Schäden auflisten & Tatbestand prüfen.',
    fr: 'Consigner les faits, détailler les préjudices & vérifier le droit.',
    ja: '事実関係を記録し、損害額を積算して法的要件を照合。',
    zh: '核实争议案情，明细损失账目并核对法定构成要件。'
  },
  stageDemandSent: {
    en: '14-Day Demand',
    hi: '14-दिवसीय मांग पत्र',
    es: 'Requerimiento de 14 Días',
    de: '14-Tage-Mahnung',
    fr: 'Mise en Demeure 14 Jours',
    ja: '14日間履行催告',
    zh: '14 日限期催告函'
  },
  stageDemandSentDesc: {
    en: 'Certified pre-lawsuit notice with statutory deadline.',
    hi: 'वैधानिक समय सीमा के साथ प्रमाणित पूर्व-मुकदमा नोटिस।',
    es: 'Notificación fehaciente previa con plazo perentorio.',
    de: 'Zustellung der vorgerichtlichen Mahnung mit Fristsetzung.',
    fr: 'Courrier recommandé préalable avec délai impératif.',
    ja: '法定出訴期日を明記した内容証明・受領確認付き催告書。',
    zh: '寄发附有明确履行期限与违约法律后果的正式起诉前律师催告函。'
  },
  stageFiled: {
    en: 'Court Filed',
    hi: 'अदालत में दायर',
    es: 'Demanda Presentada',
    de: 'Klage eingereicht',
    fr: 'Dossier Déposé',
    ja: '訴状提出・受理',
    zh: '法院登记立案'
  },
  stageFiledDesc: {
    en: 'Complaint submitted to clerk; docket number assigned.',
    hi: 'क्लर्क को शिकायत सौंपी गई; डॉकेट नंबर सौंपा गया।',
    es: 'Demanda registrada en el juzgado con número de autos.',
    de: 'Klage bei Gericht eingegangen; Aktenzeichen vergeben.',
    fr: 'Requête enregistrée au greffe ; numéro de rôle attribué.',
    ja: '裁判所書記官へ訴状を提出し、事件番号が付与。',
    zh: '起诉状已递交法庭书记官，正式配发司法诉讼案号。'
  },
  stageServed: {
    en: 'Defendant Served',
    hi: 'प्रतिवादी को तामील',
    es: 'Demandado Notificado',
    de: 'Beklagter zugestellt',
    fr: 'Défendeur Assigné',
    ja: '被告への送達完了',
    zh: '被告正式送达'
  },
  stageServedDesc: {
    en: 'Personal delivery executed; proof of service filed.',
    hi: 'व्यक्तिगत डिलीवरी निष्पादित; सेवा का प्रमाण दायर।',
    es: 'Notificación judicial practicada con acta de entrega.',
    de: 'Zustellung bewirkt; Zustellungsurkunde zu den Akten.',
    fr: 'Signification d’huissier effectuée avec preuve de dépôt.',
    ja: '適法な交付送達を実施し、裁判所へ送達証明書を提出。',
    zh: '完成合法诉讼文书司法送达，已向法庭提交有效送达回证。'
  },
  stageHearingPrep: {
    en: 'Hearing Prep',
    hi: 'सुनवाई तैयारी',
    es: 'Preparar Audiencia',
    de: 'Terminsvorbereitung',
    fr: 'Préparation d’Audience',
    ja: '期日・審理準備',
    zh: '出庭应诉准备'
  },
  stageHearingPrepDesc: {
    en: 'Practice objections, judge questioning & cross-exam.',
    hi: 'आपत्तियों, न्यायाधीश के प्रश्नों और जिरह का अभ्यास करें।',
    es: 'Ensayar objeciones, preguntas del juez y careos.',
    de: 'Einwände, Richterfragen & Beweisaufnahme üben.',
    fr: 'Simuler les objections, questions du juge et plaidoiries.',
    ja: '異議申立て演習、裁判官からの釈明問答および尋問の練習。',
    zh: '演练法庭质证异议、应对审判长法庭发问并完善辩论要点。'
  },
  stageEnforcement: {
    en: 'Enforcement',
    hi: 'प्रवर्तन व वसूली',
    es: 'Ejecución Forzosa',
    de: 'Zwangsvollstreckung',
    fr: 'Exécution Forcée',
    ja: '判決執行・差押え',
    zh: '强制执行与财产查封'
  },
  stageEnforcementDesc: {
    en: 'Writs of execution, bank levies & wage garnishments.',
    hi: 'निष्पादन रिट, बैंक लेवी और वेतन जब्ती।',
    es: 'Mandamientos de ejecución, embargos de cuentas y nóminas.',
    de: 'Vollstreckungsauftrag, Kontenpfändung & Lohnpfändung.',
    fr: 'Commandements de payer, saisies-attributions et sur salaires.',
    ja: '執行文の付与、預貯金口座差押え、給与差押え手続の申立て。',
    zh: '申请执行令书、划扣银行冻结存款并查封可变现资产。'
  },
  stageResolved: {
    en: 'Case Resolved',
    hi: 'मामला सुलझ गया',
    es: 'Caso Resuelto',
    de: 'Fall erledigt',
    fr: 'Affaire Résolue',
    ja: '事件終結・回収完了',
    zh: '结案和解回款'
  },
  stageResolvedDesc: {
    en: 'Full settlement executed or judgment collected.',
    hi: 'पूर्ण समझौता निष्पादित या निर्णय की वसूली की गई।',
    es: 'Acuerdo total ejecutado o sentencia cobrada íntegramente.',
    de: 'Vergleich vollzogen oder Urteil erfolgreich vollstreckt.',
    fr: 'Protocole d’accord exécuté ou jugement recouvré.',
    ja: '和解金の完済または勝訴判決に基づく全額回収が完了。',
    zh: '双方已达成和解协议履行完毕，或依据生效判决全额执行回款。'
  },
  pipelineCurrentStage: {
    en: 'Current Lifecycle Stage',
    hi: 'वर्तमान जीवन चक्र चरण',
    es: 'Fase Procesal Actual',
    de: 'Aktuelle Verfahrensphase',
    fr: 'Stade Actuel de la Procédure',
    ja: '現在の審理フェーズ',
    zh: '当前案件诉讼流转阶段'
  },
  pipelineAdvanceStage: {
    en: 'Advance to Next Stage',
    hi: 'अगले चरण पर बढ़ें',
    es: 'Avanzar a Siguiente Fase',
    de: 'Nächste Phase einleiten',
    fr: 'Passer à l’Étape Suivante',
    ja: '次の段階へ進める',
    zh: '推进至下一程序阶段'
  },
  pipelineOpenWorkstation: {
    en: 'Open Workstation',
    hi: 'वर्कस्टेशन खोलें',
    es: 'Abrir Estación de Trabajo',
    de: 'Arbeitsplatz öffnen',
    fr: 'Ouvrir Poste de Travail',
    ja: '担当ワークステーションを開く',
    zh: '打开相应专业工作台'
  },
  intakeRealMathBadge: {
    en: '100% Real Legal Math',
    hi: '100% वास्तविक कानूनी गणना',
    es: 'Cálculo Jurídico 100% Real',
    de: '100% echte juristische Berechnung',
    fr: 'Calcul Juridique 100% Réel',
    ja: '100% 正確な法的計算',
    zh: '100% 真实法定量化计算'
  },
  intakeTargetState: {
    en: 'Target State:',
    hi: 'लक्षित राज्य:',
    es: 'Estado / Jurisdicción:',
    de: 'Ziel-Bundesstaat:',
    fr: 'État Cible :',
    ja: '管轄州・地域:',
    zh: '适用管辖州/地区：'
  },
  intakeOpponentPlaceholder: {
    en: 'e.g. Apex Property Mgmt LLC or John Smith',
    hi: 'उदा. एपेक्स प्रॉपर्टी मैनेजमेंट या जॉन स्मिथ',
    es: 'ej. Apex Property Mgmt LLC o Juan Pérez',
    de: 'z.B. Apex Hausverwaltung GmbH oder Max Mustermann',
    fr: 'ex. Apex Gestion Immobilière ou Jean Dupont',
    ja: '例：エイペックス不動産管理株式会社 または 山田太郎',
    zh: '例如：顶峰物业管理有限公司 或 张三'
  },
  intakeSummaryPlaceholder: {
    en: 'Describe the transaction, the violation, and dates...',
    hi: 'लेन-देन, उल्लंघन और तिथियों का वर्णन करें...',
    es: 'Describa la transacción, la infracción y las fechas...',
    de: 'Beschreiben Sie den Vorgang, den Verstoß und die Daten...',
    fr: 'Décrivez la transaction, le litige et les dates...',
    ja: '取引内容、違反の事実、および発生期日を記載してください...',
    zh: '简述交易背景、对方违约事实及关键时间节点...'
  },
  intakeIncludedInPapers: {
    en: 'Included in Demand Letter & Court Form',
    hi: 'मांग पत्र और अदालती फॉर्म में शामिल',
    es: 'Incluido en Carta de Reclamación y Formulario Judicial',
    de: 'Im Mahnschreiben & Gerichtsformular enthalten',
    fr: 'Inclus dans la mise en demeure et le formulaire du tribunal',
    ja: '請求書および裁判所提出書類に自動反映',
    zh: '将自动载入律师催告函及法院立案文书'
  },
  intakeAuditTitle: {
    en: 'Live State Statutory Damage & Court Eligibility Audit:',
    hi: 'लाइव राज्य वैधानिक क्षति और अदालत पात्रता ऑडिट:',
    es: 'Auditoría en Tiempo Real de Daños Legales y Competencia Judicial:',
    de: 'Echtzeit-Prüfung gesetzlicher Schadensersatzansprüche & Gerichtszuständigkeit:',
    fr: 'Audit en Direct des Dommages-Intérêts Légaux et Compétence Juridictionnelle :',
    ja: 'リアルタイム法定損害賠償額および管轄裁判所適格性審査：',
    zh: '实时法定损害赔偿数额核算与法院管辖受案资格审查：'
  },
  intakeLawLabel: {
    en: 'Law',
    hi: 'कानून',
    es: 'Ley',
    de: 'Recht',
    fr: 'Droit',
    ja: '法',
    zh: '法'
  },
  intakeSuccessSummary: {
    en: 'Your dispute file has been securely initialized with {amount} in enforceable damages, statutory bad-faith citations, and pre-formatted legal pleadings.',
    hi: 'आपकी विवाद फ़ाइल सुरक्षित रूप से {amount} प्रवर्तनीय क्षति, वैधानिक उद्धरण और पूर्व-प्रारूपित कानूनी दस्तावेजों के साथ प्रारंभ की गई है।',
    es: 'Su expediente de disputa ha sido inicializado con {amount} en daños exigibles, citas legales y escritos procesales preformateados.',
    de: 'Ihre Streitakte wurde sicher mit {amount} vollstreckbarem Schadensersatz, gesetzlichen Zitaten und vorformatierten Schriftsätzen angelegt.',
    fr: 'Votre dossier de litige a été initialisé en toute sécurité avec {amount} de dommages-intérêts exécutoires, visas légaux et actes préformatés.',
    ja: 'お客様の紛争ファイルは、{amount}の執行可能損害賠償請求額、法令根拠、および定型訴状とともに安全に作成されました。',
    zh: '您的争议案件卷宗已安全建立，包含 {amount} 可执行法定损害赔偿请求权、法条援引依据及标准起诉文书。'
  },
  intakeRecommendedAction: {
    en: 'Recommended Next Action:',
    hi: 'अनुशंसित अगली कार्रवाई:',
    es: 'Siguiente Acción Recomendada:',
    de: 'Empfohlener nächster Schritt:',
    fr: 'Prochaine Action Recommandée :',
    ja: '推奨される次のアクション：',
    zh: '系统推荐下一步举措：'
  },
  intakeNextAction1: {
    en: 'Send the 10-Day Pre-Lawsuit Demand Letter via Certified Mail (resolves ~70% of claims before court).',
    hi: 'प्रमाणित डाक द्वारा 10-दिवसीय मुकदमा-पूर्व मांग पत्र भेजें (~70% दावों का अदालत से पहले समाधान होता है)।',
    es: 'Envíe el Requerimiento Previo de 10 Días por burofax o certificado (resuelve el ~70% antes del juicio).',
    de: 'Versenden Sie das 10-tägige Mahnschreiben per Einschreiben (löst ~70 % der Fälle vor Gericht).',
    fr: 'Envoyez la mise en demeure sous 10 jours en recommandé (résout ~70 % des litiges avant procès).',
    ja: '内容証明郵便で10日間の提訴前請求書を送付（約70%の事案が提訴前に和解解決）。',
    zh: '通过特快专递发送附带10天最终答辩期限的诉前通牒公函（约70%的纠纷可在立案前协商化解）。'
  },
  intakeNextAction2: {
    en: 'Upload your payment receipts or photos in the Evidence Locker to generate court-admissible SHA-256 exhibit stickers.',
    hi: 'अदालत-स्वीकार्य SHA-256 प्रदर्श स्टिकर उत्पन्न करने के लिए साक्ष्य लॉकर में अपनी भुगतान रसीदें या तस्वीरें अपलोड करें।',
    es: 'Suba sus comprobantes o fotos al Depósito de Pruebas para generar sellos SHA-256 admisibles en juicio.',
    de: 'Laden Sie Zahlungsbelege oder Fotos in den Beweistresor, um gerichtsverwertbare SHA-256-Siegel zu generieren.',
    fr: 'Téléversez vos reçus ou photos dans le Coffre de Preuves pour générer des scellés SHA-256 recevables.',
    ja: '証拠ロッカーに領収書や写真を登録し、法廷提出に耐えうるSHA-256改ざん防止ハッシュ印を付与。',
    zh: '将付款回单或现场照片上传至证据保全保险箱，生成符合证据真实性审查标准的SHA-256存证编码。'
  },
  intakeNextAction3: {
    en: 'Review the Prima Facie Legal Checklist in the Claim Kitchen.',
    hi: 'दावा किचन में प्रथम दृष्टया कानूनी चेकलिस्ट की समीक्षा करें।',
    es: 'Revise la Lista de Verificación Legal Prima Facie en la Cocina de Demandas.',
    de: 'Prüfen Sie die Prima-Facie-Prüfliste im Klage-Labor.',
    fr: 'Consultez la check-list juridique prima facie dans l’Atelier des Litiges.',
    ja: 'クレーム・キッチンで一応の推定（Prima Facie）要件リストを確認。',
    zh: '在立案计算工坊中逐项审查法定量能构成要件清单。'
  },
  intakeViewDemandBtn: {
    en: 'View & Print Demand Letter',
    hi: 'मांग पत्र देखें और प्रिंट करें',
    es: 'Ver e Imprimir Carta de Reclamación',
    de: 'Mahnschreiben ansehen & drucken',
    fr: 'Voir et Imprimer la Mise en Demeure',
    ja: '催告状・請求書を確認・印刷',
    zh: '查看并打印正式催告公函'
  },
  intakeOpenKitchenBtn: {
    en: 'Open Claim Kitchen Ledger',
    hi: 'दावा किचन लेज़र खोलें',
    es: 'Abrir Libro de la Cocina de Demandas',
    de: 'Klage-Hauptbuch öffnen',
    fr: 'Ouvrir le Registre de l’Atelier',
    ja: 'クレーム帳簿を開く',
    zh: '进入立案请求权账簿'
  },
  officialCourtFormsBtn: {
    en: 'Official Court Forms (SC-100 / N1)',
    hi: 'आधिकारिक अदालती फॉर्म (SC-100 / N1)',
    es: 'Formularios Judiciales Oficiales (SC-100 / N1)',
    de: 'Offizielle Gerichtsformulare (SC-100 / N1)',
    fr: 'Formulaires Judiciaires Officiels (SC-100 / N1)',
    ja: '公式裁判所書式（SC-100 / N1等）',
    zh: '官方司法表格与诉状模板（SC-100 / N1）'
  },
  masterFilingPacketBadge: {
    en: 'COURT READY',
    hi: 'अदालत तैयार',
    es: 'LISTO PARA CORTE',
    de: 'GERICHTSREIF',
    fr: 'PRÊT POUR LE GREFFE',
    ja: '提出準備完了',
    zh: '立案就绪'
  },
  burdenOfProof: {
    en: 'Burden of Proof',
    hi: 'सबूत का भार',
    es: 'Carga de la Prueba',
    de: 'Beweislast',
    fr: 'Charge de la Preuve',
    ja: '立証責任',
    zh: '举证责任与证明标准'
  },
  preponderanceStandard: {
    en: 'Preponderance Standard (More likely true than not)',
    hi: 'साक्ष्य की बहुलता मानक (सत्य होने की अधिक संभावना)',
    es: 'Estándar de Preponderancia (Más probable que no)',
    de: 'Überwiegende Wahrscheinlichkeit (Beweismaß)',
    fr: 'Prépondérance de la Preuve (Plus probable que le contraire)',
    ja: '証拠の優越（一応の確からしさ）',
    zh: '优势证据标准（高度盖然性证明要求）'
  },
  serviceWindow: {
    en: 'Service Window',
    hi: 'तामील खिड़की',
    es: 'Plazo de Notificación',
    de: 'Zustellungsfrist',
    fr: 'Délai de Signification',
    ja: '送達有効期間',
    zh: '合法送达窗口期'
  },
  serviceWindowDesc: {
    en: '90 Days from Court Filing (FRCP Rule 4(m))',
    hi: 'अदालत में दायर करने से 90 दिन (FRCP नियम 4(m))',
    es: '90 días desde la radicación judicial (FRCP Regla 4(m))',
    de: '90 Tage ab Klageerhebung (FRCP Regel 4(m))',
    fr: '90 jours à compter du dépôt au greffe (FRCP Règle 4(m))',
    ja: '裁判所受理後90日以内（連邦民事訴訟規則第4条(m)）',
    zh: '立案后 90 日内完成法定送达（FRCP 规则 4(m)）'
  },
  compensatoryRelief: {
    en: 'Compensatory Relief',
    hi: 'क्षतिपूर्ति राहत',
    es: 'Indemnización Compensatoria',
    de: 'Schadensersatzforderung',
    fr: 'Réparation Compensatoire',
    ja: '填補賠償請求額',
    zh: '直接实际损害赔偿请求权'
  },
  badFaithMultipliers: {
    en: 'Bad-Faith Multipliers',
    hi: 'दुर्भावना गुणक',
    es: 'Recargos por Mala Fe',
    de: 'Böswilligkeits-Zuschläge',
    fr: 'Pénalités pour Mauvaise Foi',
    ja: '悪意の加重制裁金倍率',
    zh: '恶意违约法定惩罚性赔偿倍率'
  },
  statutoryPenaltiesRequested: {
    en: 'Statutory Penalties & Costs Requested',
    hi: 'वैधानिक दंड और लागत का अनुरोध किया गया',
    es: 'Multas Legales y Costas Solicitadas',
    de: 'Gesetzliche Strafen & Kosten geltend gemacht',
    fr: 'Pénalités Légales & Frais Réclamés',
    ja: '法定制裁金および訴訟費用の請求',
    zh: '依法主张惩罚性赔偿金及诉讼维权合理开支'
  },
  hide28LinePaper: {
    en: 'Hide 28-Line Paper (Summary View)',
    hi: '28-पंक्ति पेपर छुपाएं (सारांश दृश्य)',
    es: 'Ocultar Papel de 28 Líneas (Vista Resumida)',
    de: '28-Zeilen-Bogen ausblenden (Übersicht)',
    fr: 'Masquer la Feuille 28 Lignes (Vue Résumée)',
    ja: '28行訴状用紙を非表示（要約ビュー）',
    zh: '收起 28 行起诉状纸（简要视图）'
  },
  show28LinePaper: {
    en: 'Expand Full 28-Line Legal Drafting Paper',
    hi: 'पूर्ण 28-पंक्ति कानूनी ड्राफ्टिंग पेपर का विस्तार करें',
    es: 'Expandir Papel Completo de Redacción Legal de 28 Líneas',
    de: 'Vollständigen 28-Zeilen-Entwurfsbogen anzeigen',
    fr: 'Afficher la Feuille Légale Complète de 28 Lignes',
    ja: '正式な28行番号付き訴状作成用紙を展開',
    zh: '展开完整 28 行法庭标准诉状文书纸'
  },
  settingsTitle: {
    en: 'Application Settings & Jurisdiction',
    hi: 'एप्लिकेशन सेटिंग्स और क्षेत्राधिकार',
    es: 'Ajustes de la Aplicación y Jurisdicción',
    de: 'Programmeinstellungen & Gerichtsstand',
    fr: 'Paramètres de l’Application & Juridiction',
    ja: 'アプリ設定および管轄裁判所',
    zh: '系统全局设置与适用司法辖区'
  },
  settingsSubtitle: {
    en: 'Configure country laws, typography size & privacy',
    hi: 'देश के कानून, टाइपोग्राफी आकार और गोपनीयता कॉन्फ़िगर करें',
    es: 'Configure leyes locales, tamaño tipográfico y privacidad',
    de: 'Landesrecht, Schriftgröße & Datenschutz konfigurieren',
    fr: 'Configurer la législation, la taille de police et la confidentialité',
    ja: '適用法域、フォントサイズ、暗号化プライバシーを設定',
    zh: '配置国家司法体系、字体量度与本地加密隐私'
  },
  saveClose: {
    en: 'Save & Close',
    hi: 'सहेजें और बंद करें',
    es: 'Guardar y Cerrar',
    de: 'Speichern & Schließen',
    fr: 'Enregistrer & Fermer',
    ja: '保存して閉じる',
    zh: '保存并关闭'
  },
  panicPurge: {
    en: 'Panic Purge: Erase All Local Data & Reset',
    hi: 'आपातकालीन पर्ज: सभी स्थानीय डेटा मिटाएं और रीसेट करें',
    es: 'Borrado de Emergencia: Eliminar Todos los Datos Locales',
    de: 'Notfall-Löschung: Alle lokalen Daten unwiderruflich löschen',
    fr: 'Purge d’Urgence : Effacer Toutes les Données Locales',
    ja: '緊急パニック消去：全ローカル案件データの完全抹消',
    zh: '紧急熔断清空：一键彻底销毁本地所有案件数据'
  }
};

const SUPPORTED_LANGS = ['en', 'hi', 'es', 'de', 'fr', 'ja', 'zh'];

// Ensure all keys exist in all languages
const keys = Object.keys(dictionary);
console.log(`Total translation keys to generate: ${keys.length}`);

let missingCount = 0;
for (const key of keys) {
  for (const lang of SUPPORTED_LANGS) {
    if (!dictionary[key][lang]) {
      console.error(`Missing key "${key}" in language "${lang}"`);
      missingCount++;
    }
  }
}

if (missingCount > 0) {
  console.error(`Found ${missingCount} missing keys!`);
  process.exit(1);
}

// Generate the updated src/services/i18n.ts file
let code = `import { SupportedLanguage, LanguageInfo } from '../types';

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  { code: 'en', name: 'English (United States)', nativeName: 'English (US)', flag: '🇺🇸', region: 'United States' },
  { code: 'hi', name: 'हिन्दी (Hindi)', nativeName: 'हिन्दी', flag: '🇮🇳', region: 'India' },
  { code: 'es', name: 'Español (España)', nativeName: 'Español', flag: '🇪🇸', region: 'Spain / Latin America' },
  { code: 'de', name: 'Deutsch (Deutschland)', nativeName: 'Deutsch', flag: '🇩🇪', region: 'Germany / Austria' },
  { code: 'fr', name: 'Français (France)', nativeName: 'Français', flag: '🇫🇷', region: 'France / Canada' },
  { code: 'ja', name: '日本語 (Japan)', nativeName: '日本語', flag: '🇯🇵', region: 'Japan' },
  { code: 'zh', name: '简体中文 (China)', nativeName: '简体中文', flag: '🇨🇳', region: 'China' },
];

export const translations: Record<SupportedLanguage, Record<string, string>> = {
`;

for (const lang of SUPPORTED_LANGS) {
  code += `  ${lang}: {\n`;
  for (const key of keys) {
    const val = dictionary[key][lang].replace(/\\/g, '\\\\').replace(/'/g, "\\'");
    code += `    ${key}: '${val}',\n`;
  }
  code += `  },\n\n`;
}

code += `};

export class I18nService {
  private static currentLanguage: SupportedLanguage = 'en';

  public static init(lang?: SupportedLanguage): void {
    if (lang) {
      this.currentLanguage = lang;
      return;
    }
    const saved = typeof window !== 'undefined' ? localStorage.getItem('suechef_language') as SupportedLanguage : null;
    if (saved && translations[saved]) {
      this.currentLanguage = saved;
    } else if (typeof navigator !== 'undefined') {
      const browserLang = navigator.language?.toLowerCase() || 'en';
      if (browserLang.startsWith('hi')) this.currentLanguage = 'hi';
      else if (browserLang.startsWith('es')) this.currentLanguage = 'es';
      else if (browserLang.startsWith('de')) this.currentLanguage = 'de';
      else if (browserLang.startsWith('fr')) this.currentLanguage = 'fr';
      else if (browserLang.startsWith('ja')) this.currentLanguage = 'ja';
      else if (browserLang.startsWith('zh')) this.currentLanguage = 'zh';
      else this.currentLanguage = 'en';
    }
  }

  public static getLanguage(): SupportedLanguage {
    return this.currentLanguage;
  }

  public static setLanguage(lang: SupportedLanguage): void {
    if (translations[lang]) {
      this.currentLanguage = lang;
      if (typeof window !== 'undefined') {
        localStorage.setItem('suechef_language', lang);
      }
    }
  }

  public static t(key: string, fallback?: string): string {
    const dict = translations[this.currentLanguage] || translations.en;
    if (dict[key]) return dict[key];
    if (translations.en[key]) return translations.en[key];
    return fallback || key;
  }

  public static format(key: string, params: Record<string, string | number>, fallback?: string): string {
    let str = this.t(key, fallback);
    for (const [k, v] of Object.entries(params)) {
      str = str.replace(new RegExp(\`\\\\{\${k}\\\\}\`, 'g'), String(v));
    }
    return str;
  }

  public static getLanguages(): LanguageInfo[] {
    return SUPPORTED_LANGUAGES;
  }
}
`;

fs.writeFileSync('src/services/i18n.ts', code, 'utf8');
console.log('Successfully wrote expanded src/services/i18n.ts with 100% dictionary parity across all 7 locales!');
