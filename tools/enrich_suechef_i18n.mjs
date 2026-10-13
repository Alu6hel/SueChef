import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const SUECHEF_DIR = '/home/davidalujones/.gemini/antigravity/scratch/SueChef';

// New keys to add to dictionary in build_suechef_i18n.mjs
const newKeys = {
  // Legalese Decoder & Clause Analyzer UI
  decoderTitle: {
    en: 'Plain-English Legal Decoder & Clause Analyzer',
    hi: 'सरल-अंग्रेजी कानूनी डिकोडर एवं खंड विश्लेषक',
    es: 'Decodificador Legal en Lenguaje Claro y Analizador de Cláusulas',
    de: 'Juristischer Klartext-Übersetzer & Vertragsklausel-Analysator',
    fr: 'Décodeur Juridique en Langage Clair & Analyseur de Clauses',
    ja: '平易な法律用語翻訳＆契約条項アナライザー',
    zh: '通俗法律用语解析与合同条款风险评估'
  },
  decoderSubtitle: {
    en: 'Paste confusing boilerplate contract clauses or search our 300+ term plain-English legal lexicon to reveal tactical procedural defenses.',
    hi: 'जटिल अनुबंध खंड चिपकाएं या सामरिक प्रक्रियात्मक बचाव खोजने के लिए कानूनी शब्दावली खोजें।',
    es: 'Pegue cláusulas confusas de contratos o busque en nuestro léxico legal para descubrir defensas procesales tácticas.',
    de: 'Fügen Sie unklare Vertragsklauseln ein oder durchsuchen Sie das Rechtslexikon, um verfahrensrechtliche Einreden zu erkennen.',
    fr: 'Collez des clauses contractuelles complexes ou parcourez le lexique pour révéler des défenses procédurales tactiques.',
    ja: '複雑な契約条項を貼り付けるか、法律用語辞書を検索して手続き上の防御策を確認できます。',
    zh: '粘贴复杂的合同格式条款，或检索通俗法律词典以发现诉讼防御抗辩要点。'
  },
  decoderZeroCloud: {
    en: 'Zero Cloud • On-Device Neural Parsing',
    hi: 'शून्य क्लाउड • ऑन-डिवाइस तंत्रिका विश्लेषण',
    es: 'Cero Nube • Análisis Neural en el Dispositivo',
    de: 'Keine Cloud • Neuronale On-Device-Analyse',
    fr: 'Zéro Cloud • Analyse Neurale sur l’Appareil',
    ja: '完全オフライン・端末内ニューラル解析',
    zh: '完全离线 • 端侧神经语义解析'
  },
  decoderInputTitle: {
    en: 'Paste Contract Clause / Boilerplate Legalese',
    hi: 'अनुबंध खंड / कानूनी भाषा चिपकाएं',
    es: 'Pegar Cláusula de Contrato / Jerga Legal',
    de: 'Vertragsklausel / Juristendeutsch einfügen',
    fr: 'Coller une Clause Contractuelle / Jargon Juridique',
    ja: '契約条項・難解な法律文章を貼り付け',
    zh: '粘贴合同条款或晦涩法律术语'
  },
  decoderPlaceholder: {
    en: 'Paste arbitration clauses, liquidated damages provisions, indemnification covenants, or lease agreements here...',
    hi: 'मध्यस्थता खंड, परिनिर्धारित हर्जाना, क्षतिपूर्ति शर्तें यहाँ चिपकाएं...',
    es: 'Pegue aquí cláusulas de arbitraje, daños liquidados, convenios de indemnización o contratos de arrendamiento...',
    de: 'Fügen Sie Schiedsklauseln, Vertragsstrafen, Freistellungsvereinbarungen oder Mietverträge hier ein...',
    fr: 'Collez ici les clauses d’arbitrage, pénalités forfaitaires, indemnités ou contrats de bail...',
    ja: '仲裁条項、損害賠償額の予定、補償合意、賃貸借契約の条文などをここに貼り付けてください...',
    zh: '在此粘贴仲裁条款、预定违约金条款、单方赔偿保证或租赁协议条款...'
  },
  decoderLoadSamples: {
    en: 'Load Common Toxic Boilerplate Clauses:',
    hi: 'सामान्य जोखिम भरे अनुबंध खंड लोड करें:',
    es: 'Cargar Cláusulas Abusivas Habituales:',
    de: 'Typische riskante Vertragsklauseln laden:',
    fr: 'Charger des Clauses Pièges Fréquentes :',
    ja: '典型的な不利条項のサンプルを読み込む：',
    zh: '加载常见霸王条款与风险样本：'
  },
  btnClearInput: {
    en: 'Clear Input',
    hi: 'इनपुट साफ़ करें',
    es: 'Borrar Texto',
    de: 'Eingabe löschen',
    fr: 'Effacer',
    ja: '入力をクリア',
    zh: '清除内容'
  },
  btnDecodeClause: {
    en: 'Decode & Analyze Clause',
    hi: 'डिकोड करें और खंड का विश्लेषण करें',
    es: 'Decodificar y Analizar Cláusula',
    de: 'Klausel entschlüsseln & analysieren',
    fr: 'Décoder & Analyser la Clause',
    ja: '条項を翻訳・リスク解析',
    zh: '通俗解析并评估条款风险'
  },
  decoderRiskAssessment: {
    en: 'RISK ASSESSMENT: {riskLevel} LEVEL TRAP',
    hi: 'जोखिम मूल्यांकन: {riskLevel} स्तर का जाल',
    es: 'EVALUACIÓN DE RIESGO: TRAMPA DE NIVEL {riskLevel}',
    de: 'RISIKOBEWERTUNG: KLAUSELFALLE STUFE {riskLevel}',
    fr: 'ÉVALUATION DU RISQUE : PIÈGE DE NIVEAU {riskLevel}',
    ja: 'リスク評価：危険度【{riskLevel}】の条項トラップ',
    zh: '法律风险评估：{riskLevel} 级陷阱条款'
  },
  decoderProceduralDefense: {
    en: 'Procedural Defense Analysis',
    hi: 'प्रक्रियात्मक रक्षा विश्लेषण',
    es: 'Análisis de Defensa Procesal',
    de: 'Verfahrensrechtliche Einredeanalyse',
    fr: 'Analyse de Défense Procédurale',
    ja: '民事訴訟手続き上の防御策分析',
    zh: '民事程序抗辩策略分析'
  },
  decoderTrapsTitle: {
    en: 'Key Legal Traps & Risks',
    hi: 'प्रमुख कानूनी जाल और जोखिम',
    es: 'Trampas y Riesgos Legales Clave',
    de: 'Wesentliche rechtliche Risiken & Fallen',
    fr: 'Pièges et Risques Juridiques Majeurs',
    ja: '主な法的落とし穴とリスク',
    zh: '核心法律陷阱与履约风险'
  },
  decoderActionsTitle: {
    en: 'Pro Se Rebuttal Action Items',
    hi: 'स्व-प्रतिनिधित्व खंडन कार्य बिंदु',
    es: 'Puntos de Acción para Refutación Pro Se',
    de: 'Konkrete Gegenmaßnahmen für Selbstvertreter',
    fr: 'Actions Concrètes de Réfutation Pro Se',
    ja: '本人訴訟（プロセ）での具体的な対抗手段',
    zh: '当事人诉讼反驳与行动要点'
  },
  decoderStatutoryDefense: {
    en: 'Statutory Authority & Voidance Standard: {statute}',
    hi: 'वैधानिक अधिकार और शून्यता मानक: {statute}',
    es: 'Fundamento Legal y Criterio de Nulidad: {statute}',
    de: 'Gesetzliche Grundlage & Nichtigkeitsnorm: {statute}',
    fr: 'Fondement Légal & Critère de Nullité : {statute}',
    ja: '根拠法令および無効化基準：{statute}',
    zh: '法定依据与条款无效认定标准：{statute}'
  },
  decoderSearchPlaceholder: {
    en: 'Search legal terms, Latin maxims, motions...',
    hi: 'कानूनी शर्तें, लैटिन कहावतें, याचिकाएं खोजें...',
    es: 'Buscar términos legales, máximas latinas, mociones...',
    de: 'Rechtsbegriffe, lateinische Maximen, Anträge suchen...',
    fr: 'Rechercher termes juridiques, maximes latines, requêtes...',
    ja: '法律用語、ラテン語法格言、申立書を検索...',
    zh: '搜索法律术语、拉丁法谚、诉讼动议...'
  },
  decoderPronounce: {
    en: 'Pronounce',
    hi: 'उच्चारण',
    es: 'Pronunciar',
    de: 'Aussprache',
    fr: 'Prononcer',
    ja: '音声発音',
    zh: '朗读发音'
  },
  decoderSpeaking: {
    en: 'Speaking...',
    hi: 'बोल रहा है...',
    es: 'Reproduciendo...',
    de: 'Spielt ab...',
    fr: 'Lecture en cours...',
    ja: '再生中...',
    zh: '正在朗读...'
  },
  decoderCopy: {
    en: 'Copy',
    hi: 'कॉपी करें',
    es: 'Copiar',
    de: 'Kopieren',
    fr: 'Copier',
    ja: 'コピー',
    zh: '复制'
  },
  decoderCopied: {
    en: 'Copied',
    hi: 'कॉपी किया गया',
    es: 'Copiado',
    de: 'Kopiert',
    fr: 'Copié',
    ja: 'コピー完了',
    zh: '已复制'
  },
  decoderDefinition: {
    en: '{category} DEFINITION',
    hi: '{category} परिभाषा',
    es: 'DEFINICIÓN: {category}',
    de: '{category}-DEFINITION',
    fr: 'DÉFINITION : {category}',
    ja: '{category} 定義',
    zh: '{category} 释义'
  },
  decoderPlainEnglish: {
    en: 'Plain-English Translation',
    hi: 'सरल-अंग्रेजी अनुवाद',
    es: 'Traducción en Lenguaje Sencillo',
    de: 'Verständliche Übersetzung',
    fr: 'Traduction en Langage Clair',
    ja: '平易な解説・日常語訳',
    zh: '大白话通俗释义'
  },
  decoderCourtContext: {
    en: 'How It Works In Court:',
    hi: 'अदालत में यह कैसे काम करता है:',
    es: 'Cómo Funciona en el Tribunal:',
    de: 'Praktische Wirkung vor Gericht:',
    fr: 'Fonctionnement au Tribunal :',
    ja: '実際の法廷での機能・適用場面：',
    zh: '法庭实务审理逻辑：'
  },
  decoderTacticalTip: {
    en: 'TACTICAL TIP FOR PRO SE LITIGANTS:',
    hi: 'स्व-प्रतिनिधित्व करने वाले वादियों के लिए सामरिक युक्ति:',
    es: 'CONSEJO TÁCTICO PARA LITIGANTES PRO SE:',
    de: 'TAKTIK-TIPP FÜR SELBSTVERTRETER (PRO SE):',
    fr: 'CONSEIL TACTIQUE POUR PLAIDEURS AUTONOMES :',
    ja: '本人訴訟（プロセ）のための戦術的アドバイス：',
    zh: '当事人本人诉讼实务攻防锦囊：'
  },
  decoderPracticalExample: {
    en: 'Practical Case Example:',
    hi: 'व्यावहारिक मामला उदाहरण:',
    es: 'Ejemplo Práctico de Caso:',
    de: 'Praxis-Fallbeispiel:',
    fr: 'Exemple Pratique de Cas :',
    ja: '実務判例・訴訟での具体例：',
    zh: '真实诉讼裁判实例如下：'
  },
  catAll: {
    en: 'all',
    hi: 'सभी',
    es: 'todos',
    de: 'alle',
    fr: 'tous',
    ja: 'すべて',
    zh: '全部'
  },
  catProcedural: {
    en: 'procedural',
    hi: 'प्रक्रियात्मक',
    es: 'procesal',
    de: 'verfahren',
    fr: 'procédure',
    ja: '訴訟手続',
    zh: '诉讼程序'
  },
  catEvidence: {
    en: 'evidence',
    hi: 'साक्ष्य',
    es: 'pruebas',
    de: 'beweise',
    fr: 'preuves',
    ja: '証拠',
    zh: '证据规则'
  },
  catContracts: {
    en: 'contracts',
    hi: 'अनुबंध',
    es: 'contratos',
    de: 'verträge',
    fr: 'contrats',
    ja: '契約',
    zh: '合同'
  },
  catTorts: {
    en: 'torts',
    hi: 'अपकृत्य',
    es: 'daños civiles',
    de: 'delikte',
    fr: 'délits',
    ja: '不法行為',
    zh: '侵权'
  },
  catLatin: {
    en: 'latin',
    hi: 'लैटिन',
    es: 'latín',
    de: 'latein',
    fr: 'latin',
    ja: 'ラテン語',
    zh: '拉丁法谚'
  },

  // Statutory UPL Modal
  uplStatutoryCompliance: {
    en: 'MANDATORY STATUTORY COMPLIANCE • ABA MODEL RULE 5.5',
    hi: 'अनिवार्य वैधानिक अनुपालन • एबीए मॉडल नियम 5.5',
    es: 'CUMPLIMIENTO ESTATUTARIO OBLIGATORIO • REGLA MODELO 5.5 DE LA ABA',
    de: 'GESETZLICHE PFLICHTANGABE • ABA MUSTERREGEL 5.5',
    fr: 'CONFORMITÉ LÉGALE OBLIGATOIRE • RÈGLE MODÈLE ABA 5.5',
    ja: '法定開示事項（義務） • 米国法曹協会（ABA）模範規則5.5準拠',
    zh: '法定合规强制披露 • 美国律师协会 (ABA) 示范规则 5.5'
  },
  uplNoticeTitle: {
    en: 'Unauthorized Practice of Law (UPL) Notice',
    hi: 'कानून के अनधिकृत अभ्यास (UPL) की सूचना',
    es: 'Aviso sobre Ejercicio No Autorizado de la Abogacía (UPL)',
    de: 'Hinweis zum Verbot unbefugter Rechtsberatung (UPL)',
    fr: 'Avis sur l’Exercice Illégal du Droit (UPL)',
    ja: '非弁活動（弁護士資格外行為・UPL）防止に関する告知',
    zh: '关于非律师从事法律业务 (UPL) 的合规声明'
  },
  uplCloseNotice: {
    en: 'Close Notice',
    hi: 'सूचना बंद करें',
    es: 'Cerrar Aviso',
    de: 'Hinweis schließen',
    fr: 'Fermer l’Avis',
    ja: '閉じる',
    zh: '关闭声明'
  },
  uplPlatformOnly: {
    en: 'LEGAL PREPARATION & EDUCATIONAL SELF-HELP PLATFORM ONLY',
    hi: 'केवल कानूनी तैयारी और शैक्षिक स्व-सहायता मंच',
    es: 'PLATAFORMA EXCLUSIVA DE PREPARACIÓN LEGAL Y AUTOAYUDA EDUCATIVA',
    de: 'REINE JURISTISCHE VORBEREITUNGS- & BILDUNGSPLATTFORM',
    fr: 'PLATEFORME DE PRÉPARATION JURIDIQUE ET D’AUTO-ASSISTANCE ÉDUCATIVE UNIQUEMENT',
    ja: '訴訟準備・自己解決学習専用プラットフォーム',
    zh: '仅供诉讼筹备、文书整理与普法教育自助使用'
  },
  uplMainQuote: {
    en: '"SueChef is a legal preparation, document organization, and self-help educational platform. SueChef is NOT a law firm and its software does not provide legal advice or create an attorney-client relationship. Users represent themselves pro se or must retain licensed legal counsel."',
    hi: '"SueChef एक कानूनी तैयारी, दस्तावेज़ संगठन और स्व-सहायता शैक्षिक मंच है। SueChef कोई कानूनी फर्म नहीं है और इसका सॉफ़्टवेयर कानूनी सलाह प्रदान नहीं करता है या वकील-मुवक्किल संबंध नहीं बनाता है। उपयोगकर्ता अदालत में स्वयं का प्रतिनिधित्व करते हैं या उन्हें लाइसेंस प्राप्त वकील की सेवा लेनी चाहिए।"',
    es: '"SueChef es una plataforma educativa de autoayuda, preparación legal y organización documental. SueChef NO es un bufete de abogados y su software no brinda asesoramiento legal ni crea una relación abogado-cliente. Los usuarios se representan a sí mismos pro se o deben contratar a un abogado colegiado."',
    de: '"SueChef ist eine Plattform zur Vorbereitung, Dokumentenorganisation und juristischen Weiterbildung. SueChef ist KEINE Anwaltskanzlei und bietet keine Rechtsberatung an noch begründet die Software ein Mandatsverhältnis. Nutzer vertreten sich selbst vor Gericht (pro se) oder müssen einen zugelassenen Anwalt beauftragen."',
    fr: '"SueChef est une plateforme éducative d’auto-assistance, de préparation juridique et d’organisation documentaire. SueChef N’EST PAS un cabinet d’avocats et ses outils ne fournissent aucun conseil juridique ni ne créent de relation avocat-client. Les utilisateurs agissent en personne (pro se) ou doivent engager un avocat agréé."',
    ja: '「SueChefは法律紛争の事前準備、証拠整理、学習支援のための自己解決プラットフォームです。SueChefは法律事務所ではなく、法的助言（リーガルアドバイス）の提供や弁護士・依頼者関係の形成は行いません。利用者は本人訴訟（プロセ）として自ら手続きを行うか、資格を有する弁護士に依頼する必要があります。」',
    zh: '“SueChef 是一个诉前准备、证据文书归档与普法教育自学工具。SueChef 并非律师事务所，本软件亦不提供正式法律意见或建立律师-客户代理关系。用户应以当事人本人身份 (pro se) 独立进行诉讼，或依法委托具备执业资质的执业律师。”'
  },
  uplCard1Title: {
    en: '1. Pro Se Self-Representation',
    hi: '1. स्व-प्रतिनिधित्व (Pro Se)',
    es: '1. Autorrepresentación Pro Se',
    de: '1. Selbstvertretung vor Gericht (Pro Se)',
    fr: '1. Auto-Représentation Pro Se',
    ja: '1. 本人訴訟（プロセ自律解決）',
    zh: '1. 当事人独立诉讼 (Pro Se)'
  },
  uplCard1Body: {
    en: 'You are representing yourself in court as a self-represented pro se litigant. All templates, calculations, and pleading sheets are automated tools that require your own independent verification.',
    hi: 'आप अदालत में स्वयं का प्रतिनिधित्व कर रहे हैं। सभी टेम्पलेट, गणनाएं और दलील पत्र स्वचालित उपकरण हैं जिनके लिए आपके अपने स्वतंत्र सत्यापन की आवश्यकता होती है।',
    es: 'Usted se representa a sí mismo en el tribunal como litigante pro se. Todas las plantillas, cálculos y escritos son herramientas automatizadas que requieren su verificación independiente.',
    de: 'Sie vertreten sich vor Gericht eigenverantwortlich als Selbstvertreter. Alle Vorlagen, Berechnungen und Schriftsätze sind Hilfsmittel, die Ihrer eigenständigen Prüfung bedürfen.',
    fr: 'Vous vous représentez vous-même devant les tribunaux en tant que plaideur pro se. Tous les modèles, calculs et mémoires sont des outils automatisés exigeant votre vérification indépendante.',
    ja: '利用者は法廷において自らを代理する本人訴訟当事者です。すべてのテンプレート、損害賠償計算、訴状様式は自動支援ツールであり、ご自身での確認が必須です。',
    zh: '您作为当事人本人自行行使诉讼权利。所有诉状模板、利息计算与举证清单均为辅助工具，需由您独立核实并承担最终法律责任。'
  },
  uplCard2Title: {
    en: '2. Evidentiary Privilege Notice',
    hi: '2. साक्ष्य विशेषाधिकार सूचना',
    es: '2. Aviso de Privilegio Probatorio',
    de: '2. Hinweis zum Anwaltsgeheimnis',
    fr: '2. Secret Professionnel & Confidentialité',
    ja: '2. 秘匿特権（守秘義務対象外）の注意',
    zh: '2. 证据保密特权限制声明'
  },
  uplCard2Body: {
    en: 'Information and documents entered into SueChef are not protected by attorney-client privilege until transmitted to a licensed attorney retained to represent you.',
    hi: 'SueChef में दर्ज की गई जानकारी और दस्तावेज़ वकील-मुवक्किल विशेषाधिकार द्वारा तब तक सुरक्षित नहीं हैं जब तक कि आपका प्रतिनिधित्व करने के लिए रखे गए लाइसेंस प्राप्त वकील को प्रेषित नहीं किए जाते।',
    es: 'La información y los documentos introducidos en SueChef no están protegidos por el secreto profesional ni privilegio abogado-cliente hasta que sean transmitidos a un abogado colegiado contratado.',
    de: 'In SueChef eingegebene Daten und Dokumente unterliegen nicht dem Anwaltsgeheimnis, solange sie nicht an einen beauftragten Rechtsanwalt übermittelt werden.',
    fr: 'Les informations et pièces saisies dans SueChef ne sont pas couvertes par le secret professionnel de l’avocat tant qu’elles ne sont pas transmises à votre avocat mandaté.',
    ja: 'SueChefに入力・保存された文書や情報は、委任契約を結んだ弁護士に送付されるまで、弁護士・依頼者間秘匿特権（Attorney-Client Privilege）の保護を受けません。',
    zh: '在输入 SueChef 的信息与材料正式递交给受托执业律师之前，不受普通法上的“律师-客户保密特权”保护。'
  },
  uplCard3Title: {
    en: '3. 100% Offline Device Privacy',
    hi: '3. 100% ऑफ़लाइन डिवाइस गोपनीयता',
    es: '3. Privacidad 100% Local en el Dispositivo',
    de: '3. 100% Lokaler Datenschutz auf dem Gerät',
    fr: '3. Confidentialité 100% Locale sur l’Appareil',
    ja: '3. 100%端末内ローカル完結プライバシー',
    zh: '3. 100% 端侧本地隐私安全'
  },
  uplCard3Body: {
    en: 'All cases, evidence SHA-256 hashes, and documents remain strictly on your local device. SueChef operates zero cloud collection servers and transmits no client legal records.',
    hi: 'सभी मामले, साक्ष्य SHA-256 हैश और दस्तावेज़ पूरी तरह से आपके स्थानीय डिवाइस पर रहते हैं। SueChef शून्य क्लाउड संग्रह सर्वर संचालित करता है।',
    es: 'Todos los casos, hashes SHA-256 de pruebas y documentos permanecen estrictamente en su dispositivo. SueChef no opera servidores de recopilación en la nube ni transmite expedientes.',
    de: 'Alle Streitfälle, SHA-256-Beweishashes und Akten verbleiben ausschließlich lokal auf Ihrem Gerät. SueChef betreibt keine Cloud-Datenspeicher.',
    fr: 'Tous les dossiers, empreintes SHA-256 des preuves et documents restent strictement stockés sur votre appareil. SueChef ne transmet aucun dossier à des serveurs cloud.',
    ja: 'すべての事件記録、SHA-256証拠ハッシュ、訴訟文書はお使いの端末内に厳格に暗号化保存されます。クラウド収集サーバーへの送信は一切行われません。',
    zh: '所有案件记录、证据 SHA-256 哈希值与文书均完全保存在本地设备中。SueChef 不设任何云端收集服务器，绝不上传您的法律隐私。'
  },
  uplCard4Title: {
    en: '4. Statutory Bar Compliance',
    hi: '4. वैधानिक बार अनुपालन',
    es: '4. Cumplimiento Estatutario del Colegio de Abogados',
    de: '4. Konformität mit Standesrichtlinien',
    fr: '4. Conformité Déontologique des Barreaux',
    ja: '4. 各国司法制度・バーアソシエーション準拠',
    zh: '4. 律师协会与司法监管合规'
  },
  uplCard4Body: {
    en: 'Complies with American Bar Association (ABA) Model Rule 5.5 and State Bar Pro Se Access to Justice Guidelines across all 50 U.S. states and international jurisdictions.',
    hi: 'सभी 50 अमेरिकी राज्यों और अंतर्राष्ट्रीय न्यायालयों में अमेरिकन बार एसोसिएशन (ABA) मॉडल नियम 5.5 और स्टेट बार प्रो से एक्सेस टू जस्टिस दिशानिर्देशों का अनुपालन करता है।',
    es: 'Cumple con la Regla Modelo 5.5 de la American Bar Association (ABA) y las Directrices de Acceso a la Justicia para Litigantes Pro Se en los 50 estados y jurisdicciones globales.',
    de: 'Erfüllt die Vorgaben der American Bar Association (ABA) Model Rule 5.5 sowie Leitlinien zum Rechtszugang für Selbstvertreter in allen 50 US-Bundesstaaten und international.',
    fr: 'Conforme à la règle modèle 5.5 de l’American Bar Association (ABA) et aux directives d’accès à la justice des justiciables pro se dans les 50 États américains et à l’international.',
    ja: '全米50州および国際管轄区における米国法曹協会（ABA）模範規則5.5および本人訴訟司法アクセス指針に完全準拠しています。',
    zh: '严格符合美国律师协会 (ABA) 示范规则 5.5 及全美 50 州与全球各主要司法辖区关于公民司法救济途径的法定自律规范。'
  },
  uplCheckbox1: {
    en: 'I acknowledge and agree: SueChef is not a law firm, does not provide legal advice, does not guarantee litigation outcomes, and I assume sole responsibility for all court filings.',
    hi: 'मैं स्वीकार करता हूं और सहमत हूं: SueChef कोई कानून फर्म नहीं है, कानूनी सलाह प्रदान नहीं करता है, मुकदमों के परिणामों की गारंटी नहीं देता है, और मैं सभी अदालती दाखिलों की पूरी जिम्मेदारी लेता हूं।',
    es: 'Reconozco y acepto: SueChef no es un bufete de abogados, no brinda asesoría legal, no garantiza resultados judiciales y asumo la responsabilidad exclusiva de todas las presentaciones judiciales.',
    de: 'Ich bestätige und willige ein: SueChef ist keine Anwaltskanzlei, bietet keine Rechtsberatung, garantiert keine Prozessergebnisse und ich übernehme die alleinige Verantwortung für alle Schriftsätze.',
    fr: 'Je reconnais et accepte : SueChef n’est pas un cabinet d’avocats, ne dispense aucun conseil juridique, ne garantit aucune issue judiciaire et j’assume l’entière responsabilité de mes dépôts d’actes.',
    ja: '【確認・同意事項】SueChefは法律事務所ではなく、法的助言を行わず、裁判の結果を保証するものではないことを理解し、法廷への提出文書に関する全責任を自身で負うことに同意します。',
    zh: '【确认并同意】本人明确知悉：SueChef 并非律师事务所，不提供法律意见，不保证案件胜诉结果，本人对递交法庭的所有文书与诉讼行为承担全部法律责任。'
  },
  uplCheckbox2: {
    en: 'I understand the Evidentiary Privilege Limitation: Information stored locally in SueChef is not covered by attorney-client privilege until retained counsel receives it.',
    hi: 'मैं साक्ष्य विशेषाधिकार सीमा को समझता हूं: SueChef में स्थानीय रूप से संग्रहीत जानकारी वकील-मुवक्किल विशेषाधिकार के अंतर्गत तब तक नहीं आती जब तक कि वकील इसे प्राप्त नहीं कर लेता।',
    es: 'Comprendo la Limitación del Privilegio Probatorio: La información guardada localmente en SueChef no está amparada por el secreto profesional hasta que un abogado contratado la reciba.',
    de: 'Ich verstehe die Beschränkung des Anwaltsgeheimnisses: Lokal in SueChef gespeicherte Informationen genießen erst dann Vertraulichkeitsschutz, wenn ein beauftragter Anwalt sie erhält.',
    fr: 'Je comprends la limitation du secret professionnel : Les données stockées localement dans SueChef ne bénéficient de la confidentialité avocat-client qu’une fois remises à un avocat désigné.',
    ja: '【秘匿特権の制限】SueChef端末内に保存された情報は、正式に委任した弁護士に受領されるまで弁護士・依頼者間秘匿特権の保護を受けないことを理解しました。',
    zh: '【保密特权范围声明】本人明确知晓：在本地设备中存储的信息，在正式递交受托律师之前，不享有律师-客户代理保密特权。'
  },
  uplTermsProtocol: {
    en: 'Terms of Use & Pro Se Self-Help Protocol v1.0.0',
    hi: 'उपयोग की शर्तें और प्रो से स्व-सहायता प्रोटोकॉल v1.0.0',
    es: 'Condiciones de Uso y Protocolo de Autoayuda Pro Se v1.0.0',
    de: 'Nutzungsbedingungen & Selbsthilfe-Protokoll v1.0.0',
    fr: 'Conditions d’Utilisation & Protocole d’Auto-Assistance v1.0.0',
    ja: '利用規約および本人訴訟自律支援プロトコル v1.0.0',
    zh: '使用条款与当事人本人诉讼自律规范协议 v1.0.0'
  },
  uplAcceptButton: {
    en: 'Accept Terms & Enter Workstation',
    hi: 'शर्तें स्वीकार करें और वर्कस्टेशन में प्रवेश करें',
    es: 'Aceptar Términos y Entrar a la Estación',
    de: 'Bedingungen akzeptieren & Arbeitsbereich betreten',
    fr: 'Accepter les Conditions & Accéder à la Station',
    ja: '規約に同意してワークステーションを開始',
    zh: '接受条款并进入诉讼工作台'
  },

  // Pricing Tiers Modal
  pricingHeaderBadge: {
    en: 'COMMERCIAL EDITIONS & LICENSING',
    hi: 'वाणिज्यिक संस्करण एवं लाइसेंसिंग',
    es: 'EDICIONES COMERCIALES Y LICENCIAS',
    de: 'KOMMERZIELLE VERSIONEN & LIZENZEN',
    fr: 'ÉDITIONS COMMERCIALES ET LICENCES',
    ja: 'コマーシャル版＆ライセンス',
    zh: '商业版本与正版授权'
  },
  pricingHeaderTitle: {
    en: 'SueChef Professional Litigation Tiers',
    hi: 'SueChef व्यावसायिक मुकदमेबाजी स्तर',
    es: 'Niveles Profesionales de Litigio SueChef',
    de: 'SueChef Professionelle Streitfall-Tarife',
    fr: 'Niveaux de Litige Professionnels SueChef',
    ja: 'SueChef プロフェッショナル訴訟スイート',
    zh: 'SueChef 专业民商事诉讼支持级别'
  },
  pricingClose: {
    en: 'Close Pricing',
    hi: 'मूल्य निर्धारण बंद करें',
    es: 'Cerrar Precios',
    de: 'Preise schließen',
    fr: 'Fermer les Tarifs',
    ja: '料金表を閉じる',
    zh: '关闭价格表'
  },
  pricingSubtitle: {
    en: 'Fair, Transparent Pricing for Pro Se Litigants & Businesses',
    hi: 'वादियों और व्यवसायों के लिए निष्पक्ष, पारदर्शी मूल्य निर्धारण',
    es: 'Precios Claros y Transparentes para Litigantes Pro Se y Empresas',
    de: 'Faire, transparente Preise für Selbstvertreter & Unternehmen',
    fr: 'Tarifs Équitables et Transparents pour Justiciables et Entreprises',
    ja: '本人訴訟当事者および事業者のための明朗会計プラン',
    zh: '为当事人与中小微企业提供清晰、透明的公道定价'
  },
  pricingSubdesc: {
    en: '100% offline-ready. Keep all work locally encrypted on your device. No hidden recurring lock-ins.',
    hi: '100% ऑफ़लाइन तैयार। सभी कार्यों को अपने डिवाइस पर स्थानीय रूप से एन्क्रिप्ट रखें। कोई छिपा हुआ शुल्क नहीं।',
    es: '100% sin conexión. Conserve su trabajo encriptado localmente en su dispositivo. Sin suscripciones forzadas.',
    de: '100% offline-fähig. Alle Daten bleiben lokal verschlüsselt auf Ihrem Gerät. Keine Abo-Fallen.',
    fr: '100% hors ligne. Conservez vos dossiers chiffrés localement sur votre appareil. Aucun abonnement caché.',
    ja: '100%オフライン対応。すべての事件記録は端末内で暗号化保持。不要な自動課金はありません。',
    zh: '100% 离线可用。数据在本地设备上全面加密保存。无任何隐藏自动续费陷阱。'
  },
  pricingFreeTitle: {
    en: 'Free Tier',
    hi: 'निःशुल्क स्तर',
    es: 'Nivel Gratuito',
    de: 'Kostenlose Stufe',
    fr: 'Version Gratuite',
    ja: 'フリープラン',
    zh: '免费基础版'
  },
  pricingFreePrice: {
    en: '$0',
    hi: '₹0',
    es: '0 €',
    de: '0 €',
    fr: '0 €',
    ja: '0円',
    zh: '¥0'
  },
  pricingFreeSub: {
    en: 'Always Free / Educational',
    hi: 'हमेशा मुफ़्त / शैक्षिक',
    es: 'Siempre Gratis / Educativo',
    de: 'Dauerhaft kostenlos / Bildung',
    fr: 'Toujours Gratuit / Éducatif',
    ja: '完全無料・学習向け',
    zh: '永久免费 / 普法教育'
  },
  pricingFreeF1: {
    en: 'Legalese decoder & legal dictionary',
    hi: 'कानूनी डिकोडर और कानूनी शब्दकोश',
    es: 'Decodificador de jerga y diccionario legal',
    de: 'Juristischer Übersetzer & Rechtslexikon',
    fr: 'Décodeur juridique & dictionnaire de droit',
    ja: '法律用語翻訳＆法学辞書機能',
    zh: '法言法语通俗解析与法律名词词典'
  },
  pricingFreeF2: {
    en: 'Basic civil dispute checklist',
    hi: 'बुनियादी नागरिक विवाद चेकलिस्ट',
    es: 'Lista de verificación básica de litigios civiles',
    de: 'Basis-Checkliste für Zivilstreitigkeiten',
    fr: 'Check-list de litige civil de base',
    ja: '基本民事紛争チェックリスト',
    zh: '基础民事纠纷要件事实核对表'
  },
  pricingFreeF3: {
    en: '50-State small claims statutory limits',
    hi: '50 राज्यों की छोटी दावों की वैधानिक सीमाएं',
    es: 'Límites estatutarios de cuantía menor en los 50 estados',
    de: 'Gesetzliche Streitwertgrenzen für Bagatellklagen (50 Staaten)',
    fr: 'Plafonds légaux des petites créances des 50 États',
    ja: '全米50州少額訴訟の管轄上限額早見表',
    zh: '全美 50 州小额法庭法定起诉标的限额速查'
  },
  pricingFreeF4: {
    en: 'Basic fee waiver guidance',
    hi: 'बुनियादी शुल्क माफी मार्गदर्शन',
    es: 'Orientación básica para exención de tasas judiciales',
    de: 'Leitfaden für Prozesskostenhilfe / Gerichtskostenbefreiung',
    fr: 'Guide d’aide juridictionnelle & exonération de frais',
    ja: '訴訟費用免除申請の基本ガイド',
    zh: '诉讼费缓减免申请实用指引'
  },
  pricingFreeSelect: {
    en: 'Select Free',
    hi: 'निःशुल्क चुनें',
    es: 'Elegir Gratis',
    de: 'Kostenlos wählen',
    fr: 'Choisir Gratuit',
    ja: '無料プランを選択',
    zh: '选择免费版'
  },
  pricingFreeCurrent: {
    en: 'Current Tier',
    hi: 'वर्तमान स्तर',
    es: 'Nivel Actual',
    de: 'Aktiver Tarif',
    fr: 'Niveau Actuel',
    ja: '現在のプラン',
    zh: '当前所用级别'
  },
  pricingProPopular: {
    en: 'Most Popular for Court',
    hi: 'अदालत के लिए सबसे लोकप्रिय',
    es: 'Más Popular para Tribunales',
    de: 'Am beliebtesten vor Gericht',
    fr: 'Le Plus Populaire au Tribunal',
    ja: '法廷対策で最も選ばれています',
    zh: '诉讼开庭实战首选'
  },
  pricingProTitle: {
    en: 'Pro Litigant',
    hi: 'प्रो वादी',
    es: 'Litigante Pro',
    de: 'Prozess-Profi (Pro Litigant)',
    fr: 'Plaideur Professionnel',
    ja: 'プロ訴訟エディション',
    zh: '诉讼攻防专业版'
  },
  pricingProPrice: {
    en: '$49',
    hi: '₹3,999',
    es: '49 €',
    de: '49 €',
    fr: '49 €',
    ja: '6,800円',
    zh: '¥349'
  },
  pricingProPriceUnit: {
    en: '/case or $19.99/mo',
    hi: '/मामला या ₹1,599/माह',
    es: '/caso o 19,99 €/mes',
    de: '/Fall oder 19,99 €/Monat',
    fr: '/dossier ou 19,99 €/mois',
    ja: '/件 または 2,800円/月',
    zh: '/案 或 ¥139/月'
  },
  pricingProSub: {
    en: 'Complete Legal Court Arsenal',
    hi: 'पूर्ण कानूनी अदालत शस्त्रागार',
    es: 'Arsenal Completo para Litigios Judiciales',
    de: 'Vollständiges juristisches Prozessarsenal',
    fr: 'Arsenal Judiciaire Complet',
    ja: '充実した法廷訴訟ツール一式',
    zh: '法庭决战全套武器库'
  },
  pricingProF1: {
    en: 'Full 28-Line Pleading Generator (California & Federal format)',
    hi: 'पूर्ण 28-पंक्ति याचिका जनरेटर (कैलिफोर्निया और संघीय प्रारूप)',
    es: 'Generador de Escritos de 28 Líneas (formato California y Federal)',
    de: '28-Zeilen-Schriftsatzgenerator (Kalifornien & Bundesformat)',
    fr: 'Générateur d’actes 28 lignes (formats Californie et Fédéral)',
    ja: '28行形式公式訴状ジェネレーター（カリフォルニア・連邦裁判所準拠）',
    zh: '标准 28 行起诉状生成器 (加州及联邦双格式)'
  },
  pricingProF2: {
    en: 'Formal Demand Letters with pre-judgment statutory interest',
    hi: 'पूर्व-निर्णय वैधानिक ब्याज के साथ औपचारिक मांग पत्र',
    es: 'Cartas de Reclamación Formal con intereses previos al fallo',
    de: 'Mahn- & Aufforderungsschreiben mit Verzugszinsenberechnung',
    fr: 'Mises en demeure formelles avec intérêts moratoires légaux',
    ja: '判決前法定利息計算付き正式催告書（内容証明対応）作成',
    zh: '包含判决前法定利息计算的标准律师催告函'
  },
  pricingProF3: {
    en: 'SHA-256 Evidence Hashing & FRE 901 chain-of-custody stamping',
    hi: 'SHA-256 साक्ष्य हैशिंग और FRE 901 साक्ष्य श्रृंखला मुद्रांकन',
    es: 'Hashing SHA-256 de pruebas y sellado de cadena de custodia FRE 901',
    de: 'SHA-256-Beweishashes & FRE 901-Kettensicherung',
    fr: 'Scellement SHA-256 des preuves & conformité chaîne de garde FRE 901',
    ja: 'SHA-256証拠ハッシュ生成＆連邦証拠規則901管理連続性スタンプ',
    zh: 'SHA-256 证据防篡改哈希核验与 FRE 901 证据保管链存证'
  },
  pricingProF4: {
    en: 'Master Attorney Dossier export & print',
    hi: 'मास्टर अटॉर्नी डोजियर निर्यात और प्रिंट',
    es: 'Exportación e impresión del Dossier del Abogado Contrario',
    de: 'Export & Druck des Anwaltsdossiers',
    fr: 'Exportation et impression du dossier d’avocat',
    ja: '相手方代理人弁護士プロファイルのエクスポート＆印刷',
    zh: '对方代理律师背景策略档案导出与打印'
  },
  pricingProF5: {
    en: 'Interactive Mock Hearing objection simulator',
    hi: 'इंटरैक्टिव मॉक सुनवाई आपत्ति सिम्युलेटर',
    es: 'Simulador interactivo de objeciones para juicio simulado',
    de: 'Interaktiver Verhandlungssimulator für Einwände',
    fr: 'Simulateur interactif d’objections pour audience fictive',
    ja: '法廷異議申し立て（Objection）模擬シミュレーター',
    zh: '法庭举证质证与程序异议模拟对抗实训'
  },
  pricingProSelect: {
    en: 'Activate Pro Litigant',
    hi: 'प्रो वादी सक्रिय करें',
    es: 'Activar Litigante Pro',
    de: 'Prozess-Profi aktivieren',
    fr: 'Activer Plaideur Pro',
    ja: 'プロプランを有効化',
    zh: '激活专业版权限'
  },
  pricingProCurrent: {
    en: '✓ Pro Tier Active',
    hi: '✓ प्रो स्तर सक्रिय है',
    es: '✓ Nivel Pro Activo',
    de: '✓ Pro-Tarif aktiv',
    fr: '✓ Niveau Pro Actif',
    ja: '✓ プロプラン適用中',
    zh: '✓ 专业版已激活'
  },
  pricingBizTitle: {
    en: 'Business / Landlord',
    hi: 'व्यवसाय / मकान मालिक',
    es: 'Empresas y Propietarios',
    de: 'Unternehmen / Vermieter',
    fr: 'Entreprises / Bailleurs',
    ja: '法人・不動産オーナー版',
    zh: '企业主与商户定制版'
  },
  pricingBizPrice: {
    en: '$99 – $199',
    hi: '₹7,999 – ₹15,999',
    es: '99 € – 199 €',
    de: '99 € – 199 €',
    fr: '99 € – 199 €',
    ja: '14,800円 – 29,800円',
    zh: '¥699 – ¥1,399'
  },
  pricingBizPriceUnit: {
    en: '/yr',
    hi: '/वर्ष',
    es: '/año',
    de: '/Jahr',
    fr: '/an',
    ja: '/年',
    zh: '/年'
  },
  pricingBizSub: {
    en: 'Multi-Case Organization',
    hi: 'बहु-मामला संगठन',
    es: 'Gestión Multicaso Empresarial',
    de: 'Organisation mehrerer Streitfälle',
    fr: 'Gestion Multi-Dossiers Entreprise',
    ja: '複数事件一括管理',
    zh: '多纠纷批量化并案管理'
  },
  pricingBizF1: {
    en: 'Unlimited Multi-Case Dashboard',
    hi: 'असीमित बहु-मामला डैशबोर्ड',
    es: 'Panel Multicaso Ilimitado',
    de: 'Unbegrenztes Dashboard für mehrere Fälle',
    fr: 'Tableau de bord multi-dossiers illimité',
    ja: '無制限マルチケース管理ダッシュボード',
    zh: '无限制多案件统一监管仪表板'
  },
  pricingBizF2: {
    en: 'Security deposit recovery & accounting',
    hi: 'सुरक्षा जमा वसूली और लेखांकन',
    es: 'Contabilidad y recuperación de depósitos de garantía',
    de: 'Kautionsabrechnung & Kautionsrückforderung',
    fr: 'Comptabilité et recouvrement des dépôts de garantie',
    ja: '敷金・保証金返還精算および明細管理',
    zh: '房屋押金与租赁保证金核算追偿'
  },
  pricingBizF3: {
    en: 'Unpaid invoice & contractor demand tracking',
    hi: 'अवैतनिक चालान और ठेकेदार मांग ट्रैकिंग',
    es: 'Seguimiento de facturas impagadas y demandas a contratistas',
    de: 'Forderungsmanagement für unbezahlte Rechnungen',
    fr: 'Suivi des factures impayées et litiges prestataires',
    ja: '未払い請求書・請負業者債権回収トラッキング',
    zh: '应收账款逾期催收与工程欠款追索'
  },
  pricingBizF4: {
    en: 'Certified mail tracking log & USPS skip tracing',
    hi: 'प्रमाणित मेल ट्रैकिंग लॉग और डाक सेवा स्किप ट्रेसिंग',
    es: 'Registro de correo certificado y localización postal',
    de: 'Einschreiben-Verfolgungsprotokoll & Nachforschungen',
    fr: 'Registre de suivi des courriers recommandés',
    ja: '配達証明郵便（書留）追跡ログ＆送達調査',
    zh: '特快专递挂号信溯源追踪与地址排查'
  },
  pricingBizF5: {
    en: 'Zero-Knowledge AES-GCM Encrypted Vault backups',
    hi: 'शून्य-ज्ञान AES-GCM एन्क्रिप्टेड वॉल्ट बैकअप',
    es: 'Copias de seguridad en bóveda encriptada AES-GCM de conocimiento cero',
    de: 'Zero-Knowledge AES-GCM verschlüsselte Tresor-Backups',
    fr: 'Sauvegardes chiffrées AES-GCM à connaissance nulle',
    ja: 'ゼロ知識証明AES-GCM暗号化保管庫バックアップ',
    zh: '零知识 AES-GCM 本地加密保险箱档案备份'
  },
  pricingBizSelect: {
    en: 'Select Business Tier',
    hi: 'व्यवसाय स्तर चुनें',
    es: 'Elegir Nivel Empresarial',
    de: 'Business-Tarif wählen',
    fr: 'Sélectionner l’Offre Entreprise',
    ja: 'ビジネスプランを選択',
    zh: '选定企业商户版'
  },
  pricingBizCurrent: {
    en: '✓ Business Active',
    hi: '✓ व्यवसाय सक्रिय है',
    es: '✓ Plan Empresarial Activo',
    de: '✓ Business aktiv',
    fr: '✓ Offre Entreprise Active',
    ja: '✓ ビジネスプラン適用中',
    zh: '✓ 企业商户版已激活'
  },
  pricingActiveCase: {
    en: 'Active Case: {caseTitle}',
    hi: 'सक्रिय मामला: {caseTitle}',
    es: 'Caso Activo: {caseTitle}',
    de: 'Aktiver Fall: {caseTitle}',
    fr: 'Dossier Actif : {caseTitle}',
    ja: '選択中の事件：{caseTitle}',
    zh: '当前正在处理的纠纷：{caseTitle}'
  },
  pricingDone: {
    en: 'Done',
    hi: 'संपन्न',
    es: 'Listo',
    de: 'Fertig',
    fr: 'Terminé',
    ja: '完了',
    zh: '完成'
  },

  // Workstation Headers for other tabs
  claimKitchenTitle: {
    en: 'The Claim Kitchen',
    hi: 'द क्लेम किचन',
    es: 'La Cocina de Demandas (Claim Kitchen)',
    de: 'Die Klage-Küche (Claim Kitchen)',
    fr: 'La Cuisine des Réclamations',
    ja: 'クレーム・キッチン（請求要件ラボ）',
    zh: '诉求厨房 (Claim Kitchen)'
  },
  claimKitchenSubtitle: {
    en: 'Dispute Strength Evaluator, Plain-English Legal Requirements & Damages Calculator',
    hi: 'विवाद शक्ति मूल्यांकनकर्ता, सरल कानूनी आवश्यकताएं और क्षति कैलकुलेटर',
    es: 'Evaluador de Solidez de Demandas, Requisitos Legales y Calculadora de Daños',
    de: 'Klageerfolgs-Prüfung, verständliche Anspruchsvoraussetzungen & Schadensrechner',
    fr: 'Évaluation de la Solidité du Litige, Exigences Légales & Calculateur de Préjudices',
    ja: '勝訴可能性判定、法律要件の平易解説、および損害賠償計算機',
    zh: '诉讼胜诉力评估、大白话实体法定要件与法定赔偿金计算器'
  },
  meritStrengthScore: {
    en: 'Merit Strength Score',
    hi: 'योग्यता शक्ति स्कोर',
    es: 'Puntuación de Solidez Jurídica',
    de: 'Erfolgsaussichts-Score',
    fr: 'Score de Solidité Juridique',
    ja: '勝訴見込みスコア',
    zh: '诉求成立胜算评估分'
  }
};

// 1. Update tools/build_suechef_i18n.mjs
const buildScriptPath = path.join(SUECHEF_DIR, 'tools/build_suechef_i18n.mjs');
let buildScript = fs.readFileSync(buildScriptPath, 'utf8');

let keysToAppend = '';
for (const [k, v] of Object.entries(newKeys)) {
  if (!buildScript.includes(`${k}: {`)) {
    keysToAppend += `  ${k}: ${JSON.stringify(v, null, 4)},\n`;
  }
}

if (keysToAppend) {
  const dictIdx = buildScript.indexOf('const dictionary = {');
  if (dictIdx !== -1) {
    const insertPos = dictIdx + 'const dictionary = {\n'.length;
    buildScript = buildScript.slice(0, insertPos) + keysToAppend + buildScript.slice(insertPos);
    fs.writeFileSync(buildScriptPath, buildScript, 'utf8');
    console.log(`Added ${Object.keys(newKeys).length} keys to build_suechef_i18n.mjs!`);
  }
} else {
  console.log('All keys already present in build_suechef_i18n.mjs.');
}

// 2. Run build_suechef_i18n.mjs
execSync('node tools/build_suechef_i18n.mjs', { cwd: SUECHEF_DIR, stdio: 'inherit' });
console.log('Regenerated src/services/i18n.ts successfully!');
