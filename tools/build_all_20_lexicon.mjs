import fs from 'fs';
import path from 'path';

const SUECHEF_DIR = '/home/davidalujones/.gemini/antigravity/scratch/SueChef';

const LEXICON_ENTRIES = [
  {
    id: 'demurrer',
    term: {
      en: 'Demurrer',
      hi: 'डेमरर (आपत्ति याचिका)',
      es: 'Demurrer (Objeción de Demanda)',
      de: 'Demurrer (Klageabweisungsrüge)',
      fr: 'Demurrer (Exception Préliminaire)',
      ja: 'デマラー（請求不成立の抗弁）',
      zh: '法律异议 (Demurrer / 实体不构成违法抗辩)'
    },
    phonetic: 'dih-MUR-er',
    category: 'procedural',
    plainEnglish: {
      en: 'A formal objection saying: "Even if everything the plaintiff says in their complaint is 100% true, it still does not amount to a legal violation that a court can fix."',
      hi: 'एक औपचारिक आपत्ति जिसमें कहा गया है: "भले ही वादी अपनी शिकायत में जो कुछ भी कहता है वह 100% सच हो, फिर भी यह ऐसा कानूनी उल्लंघन नहीं बनता जिसे अदालत ठीक कर सके।"',
      es: 'Una objeción formal que sostiene: "Incluso si todo lo que el demandante afirma en su demanda es 100% verídico, aún así no constituye una infracción legal que el tribunal pueda remediar."',
      de: 'Eine formelle verfahrensrechtliche Rüge: "Selbst wenn alle Tatsachenbehauptungen des Klägers zu 100% wahr wären, ergibt sich daraus keine rechtliche Pflichtverletzung, die ein Gericht zusprechen könnte."',
      fr: 'Une objection formelle affirmant : "Même si tout ce que le demandeur prétend dans sa plainte est 100% vrai, cela ne constitue pas une violation de la loi que le tribunal peut réparer."',
      ja: '正式な手続き上の異議申し立て：「原告の訴状に記載された主張がすべて真実であると仮定しても、裁判所が救済できる法的権利侵害には該当しない」と主張するもの。',
      zh: '一项正式程序异议，意为：“即使原告在诉状中所陈述的所有事实100%属实，在法律上也根本不构成法院有权审理或支持的违法侵权事实。”'
    },
    courtContext: {
      en: 'Used in states like California instead of a Motion to Dismiss. It attacks defects appearing on the face of the complaint without introducing outside evidence.',
      hi: 'खारिज करने के प्रस्ताव के बजाय कैलिफोर्निया जैसे राज्यों में उपयोग किया जाता है। यह बाहरी साक्ष्य पेश किए बिना शिकायत के प्रत्यक्ष दोषों पर हमला करता है।',
      es: 'Utilizado en estados como California en lugar de una Moción de Desestimación. Ataca defectos que aparecen a simple vista en la demanda sin introducir pruebas externas.',
      de: 'Wird in US-Bundesstaaten wie Kalifornien anstelle eines Motion to Dismiss eingesetzt. Greift Mängel an, die direkt aus dem Wortlaut der Klageschrift ersichtlich sind.',
      fr: 'Utilisé dans des États comme la Californie au lieu d’une requête en rejet. Il attaque les vices apparents de la plainte sans verser d’éléments extérieurs.',
      ja: 'カリフォルニア州などで却下申立（Motion to Dismiss）の代わりに使用。外部証拠を提出せず、訴状自体の記載上の不備・欠陥を突く手続き。',
      zh: '在加利福尼亚州等司法管辖区用于替代“驳回起诉动议”。无需提交外部证据，直接指出诉状字面本身存在的致命法律缺陷。'
    },
    proSeTip: {
      en: 'If hit with a demurrer, you usually get "leave to amend," meaning 10–30 days to rewrite your complaint to fix the missing legal elements.',
      hi: 'यदि आपके खिलाफ डेमरर दायर किया जाता है, तो आपको आमतौर पर "संशोधन की अनुमति" (10-30 दिन) मिलती है ताकि आप छूटे हुए कानूनी तत्वों को ठीक कर सकें।',
      es: 'Si recibe un demurrer, el juez normalmente concede "permiso para enmendar", otorgando 10–30 días para reescribir su demanda y subsanar los elementos faltantes.',
      de: 'Wird eine Demurrer erhoben, gewährt das Gericht meist eine Nachbesserungsfrist ("leave to amend") von 10–30 Tagen zur Überarbeitung der Klagebegründung.',
      fr: 'Si vous faites l’objet d’un demurrer, le juge vous accorde généralement un délai d’amendement de 10 à 30 jours pour reformuler votre demande.',
      ja: 'デマラーを出された場合、通常「補正の許可（Leave to amend）」が与えられ、10〜30日以内に訴状を書き直して要件を満たすことが可能です。',
      zh: '如果遭遇 demurrer，法官通常会给予“修改起诉状许可 (leave to amend)”，即 10-30 天的时间补充缺失的法定成立要件并重新提交。'
    },
    exampleSentence: {
      en: 'The landlord filed a demurrer arguing that the tenant failed to state a valid cause of action for breach of the implied warranty of habitability.',
      hi: 'मकान मालिक ने यह तर्क देते हुए एक डेमरर दायर किया कि किरायेदार रहने की योग्यता की निहित वारंटी के उल्लंघन के लिए वैध कारण बताने में विफल रहा।',
      es: 'El propietario presentó un demurrer alegando que el inquilino no expuso una causa legal válida por incumplimiento de la garantía implícita de habitabilidad.',
      de: 'Der Vermieter reichte eine Demurrer ein und argumentierte, die Klagebegründung reiche für eine Verletzung der Gewährleistung der Bewohnbarkeit rechtlich nicht aus.',
      fr: 'Le bailleur a déposé un demurrer en affirmant que le locataire n’avait pas établi de motif d’action valable pour violation de la garantie d’habitabilité.',
      ja: '賃貸人は、賃借人の主張が居住適格性保証違反の正当な訴訟原因を構成していないとしてデマラーを申し立てた。',
      zh: '房东提出了 demurrer 法律异议，抗辩称租客未能依法列明构成违反房屋默示适居保证的有效诉由。'
    }
  },
  {
    id: 'motion_to_dismiss',
    term: {
      en: 'Motion to Dismiss (FRCP Rule 12(b)(6))',
      hi: 'खारिज करने का प्रस्ताव (FRCP नियम 12(b)(6))',
      es: 'Moción de Desestimación (FRCP Regla 12(b)(6))',
      de: 'Klageabweisungsantrag (FRCP Rule 12(b)(6))',
      fr: 'Requête en Rejet (FRCP Règle 12(b)(6))',
      ja: '却下の申立て（連邦民事訴訟規則第12条b項6号）',
      zh: '驳回起诉动议 (FRCP 规则 12(b)(6))'
    },
    phonetic: 'MOH-shun too dis-MIS',
    category: 'procedural',
    plainEnglish: {
      en: 'A formal request asking the judge to throw out the lawsuit immediately because the paperwork fails to state a plausible legal claim or is filed in the wrong court.',
      hi: 'न्यायाधीश से मुकदमे को तुरंत खारिज करने का औपचारिक अनुरोध क्योंकि कागजी कार्रवाई एक प्रशंसनीय कानूनी दावा बताने में विफल रहती है।',
      es: 'Una solicitud formal que pide al juez desestimar la demanda de inmediato debido a que los escritos no exponen un reclamo legal verosímil.',
      de: 'Ein formeller Antrag an das Gericht, die Klage sofort abzuweisen, weil sie keinen schlüssigen Klageanspruch begründet.',
      fr: 'Une demande formelle invitant le juge à rejeter immédiatement l’action car l’acte introductif ne formule aucun motif juridique valable.',
      ja: '訴状の記載が法的に成立し得ないか管轄違いであることを理由に、裁判官に直ちに訴訟を却下するよう求める正式な申立て。',
      zh: '请求法官立即裁定驳回原告起诉的正式动议，理由是诉状未能陈述在法律上具有合理成立可能性的诉求或起诉法院无管辖权。'
    },
    courtContext: {
      en: 'The standard federal procedural defense filed before answering the complaint.',
      hi: 'शिकायत का उत्तर देने से पहले दायर किया जाने वाला मानक संघीय प्रक्रियात्मक बचाव।',
      es: 'La defensa procesal federal estándar presentada antes de contestar la demanda.',
      de: 'Die standardmäßige prozessuale Einrede vor Klageerwiderung im US-Bundesrecht.',
      fr: 'La défense procédurale standard présentée avant de répondre au fond de la plainte.',
      ja: '連邦裁判所において本案の答弁書を提出する前に申し立てられる標準的防御手続き。',
      zh: '普通法系联邦法院中被告在提交正式答辩状之前行使的标配程序抗辩。'
    },
    proSeTip: {
      en: 'Ensure your complaint contains specific facts establishing each element of your claim rather than vague conclusory accusations.',
      hi: 'सुनिश्चित करें कि आपकी शिकायत में अस्पष्ट आरोपों के बजाय प्रत्येक तत्व को स्थापित करने वाले विशिष्ट तथ्य शामिल हों।',
      es: 'Asegúrese de que su demanda contenga hechos específicos que respalden cada elemento en lugar de acusaciones genéricas.',
      de: 'Stellen Sie sicher, dass Ihre Klageschrift konkrete Tatsachen für jedes Tatbestandsmerkmal anführt statt pauschaler Behauptungen.',
      fr: 'Veillez à ce que votre plainte relate des faits précis prouvant chaque élément juridique plutôt que de vagues conclusions.',
      ja: '抽象的な主張ではなく、請求の各要件事実を裏付ける具体的な事実関係を漏れなく明記してください。',
      zh: '起诉状中必须详尽陈述支撑各项要件事实的具体事实经过，切忌使用空洞模糊的结论性指责。'
    },
    exampleSentence: {
      en: 'Defendant filed a Rule 12(b)(6) Motion to Dismiss asserting the claim was barred by the two-year statute of limitations.',
      hi: 'प्रतिवादी ने यह दावा करते हुए नियम 12(b)(6) के तहत खारिज करने का प्रस्ताव दायर किया कि दावा दो साल की सीमा द्वारा वर्जित था।',
      es: 'El demandado presentó una Moción de Desestimación bajo la Regla 12(b)(6) alegando que la acción prescribió por el plazo de dos años.',
      de: 'Der Beklagte beantragte Klageabweisung nach Rule 12(b)(6) mit der Begründung, der Anspruch sei nach zwei Jahren verjährt.',
      fr: 'Le défendeur a déposé une requête en rejet selon la règle 12(b)(6) invoquant la prescription biennale de l’action.',
      ja: '被告は2年の消滅時効により請求権が失効していると主張して規則12条b項6号に基づく却下申立を行った。',
      zh: '被告根据第 12(b)(6) 条规则提出了驳回起诉动议，主张原告的权利主张已过两年法定诉讼时效。'
    }
  },
  {
    id: 'summary_judgment',
    term: {
      en: 'Summary Judgment (FRCP Rule 56)',
      hi: 'सारांश निर्णय (FRCP नियम 56)',
      es: 'Juicio Sumario (FRCP Regla 56)',
      de: 'Summary Judgment (Entscheidung nach Aktenlage)',
      fr: 'Jugement Sommaire (FRCP Règle 56)',
      ja: '即決判決・サマリージャッジメント（FRCP規則第56条）',
      zh: '简易判决 (FRCP 规则 56 / 无争议即时判决)'
    },
    phonetic: 'SUM-uh-ree JUHJ-munt',
    category: 'procedural',
    plainEnglish: {
      en: 'A decision by the judge deciding the lawsuit before a trial happens because the key facts are completely undisputed, leaving only a question of law to apply.',
      hi: 'मुकदमे की सुनवाई से पहले न्यायाधीश का फैसला क्योंकि प्रमुख तथ्य पूरी तरह से निर्विवाद हैं, केवल कानून लागू करने का प्रश्न रह जाता है।',
      es: 'Una decisión del juez que resuelve el litigio antes de ir a juicio porque los hechos materiales no son objeto de disputa, restando solo aplicar el derecho.',
      de: 'Gerichtliche Entscheidung ohne Hauptverhandlung, da die entscheidungserheblichen Tatsachen unstreitig sind und nur eine Rechtsfrage zu klären ist.',
      fr: 'Une décision du juge tranchant le litige sans procès car les faits essentiels ne sont pas contestés, ne laissant qu’une question de droit à trancher.',
      ja: '重要な事実関係に争いがないため、事実審理（トライアル）を行わずに裁判官が純粋な法律論のみで下す終局判決。',
      zh: '法官在正式庭审之前直接作出的裁判。当案件事实要素完全确凿且无任何实质争议时，无需进行陪审团听证，直接依法下达判决。'
    },
    courtContext: {
      en: 'Brought after discovery when evidence (contracts, receipts, admissions) shows one side must win as a matter of law.',
      hi: 'साक्ष्य खोज के बाद लाया जाता है जब अनुबंध और रसीदें दिखाती हैं कि एक पक्ष कानून के रूप में जीतना चाहिए।',
      es: 'Se presenta tras la etapa de descubrimiento probatorio cuando las pruebas documentales demuestran que una parte debe vencer por ministerio de la ley.',
      de: 'Wird nach Beweiserhebung gestellt, wenn Verträge oder Belege beweisen, dass eine Partei zwingend nach dem Gesetz gewinnen muss.',
      fr: 'Présenté après la communication des pièces lorsque les preuves écrites démontrent qu’une partie doit l’emporter en droit.',
      ja: '証拠開示（ディスカバリー）終了後、提出された書証により一方が法的に勝訴することが明白である場合に申立て。',
      zh: '在证据开示阶段结束后提起。书证及自认已无可辩驳地证明某一方在法律层面上必然胜诉。'
    },
    proSeTip: {
      en: 'To defeat a motion for summary judgment, you must produce admissible evidence showing a "genuine dispute of material fact."',
      hi: 'सारांश निर्णय को हराने के लिए, आपको "भौतिक तथ्य का वास्तविक विवाद" दिखाने वाले स्वीकार्य साक्ष्य प्रस्तुत करने होंगे।',
      es: 'Para rechazar un juicio sumario, debe aportar pruebas admisibles que demuestren una "disputa genuina sobre hechos materiales".',
      de: 'Um einen Summary-Judgment-Antrag abzuwehren, müssen Sie zulässige Beweise für einen echten Streit über wesentliche Tatsachen vorlegen.',
      fr: 'Pour faire échec à un jugement sommaire, vous devez produire des éléments admissibles démontrant une véritable contestation sur un fait matériel.',
      ja: '即決判決申立に対抗するには、「重要な事実に関する真の争い（Genuine dispute of material fact）」を証拠付きで示す必要があります。',
      zh: '欲成功阻击对方的简易判决动议，您必须提交具有可采性的确凿证据，证明案件存在“实质性重要事实争议”。'
    },
    exampleSentence: {
      en: 'Plaintiff moved for summary judgment on the unpaid invoice, showing signed receipts and zero payment records.',
      hi: 'वादी ने अवैतनिक चालान पर सारांश निर्णय के लिए कदम उठाया, जिसमें हस्ताक्षरित रसीदें और शून्य भुगतान रिकॉर्ड दिखाए गए।',
      es: 'El demandante solicitó juicio sumario sobre la factura impagada, adjuntando albaranes firmados y la ausencia de registros de pago.',
      de: 'Die Klägerin beantragte eine Entscheidung nach Aktenlage wegen unbezahlter Rechnungen unter Vorlage unterschriebener Belege.',
      fr: 'Le demandeur a sollicité un jugement sommaire pour facture impayée, produisant les reçus signés et l’absence de tout paiement.',
      ja: '原告は署名入り領収書と未払い記録を提出し、未払い請求書に関する即決判決を申し立てた。',
      zh: '原告就未清偿发票申请了简易判决，出示了签字收据以及被告零付款凭证。'
    }
  },
  {
    id: 'subpoena_duces_tecum',
    term: {
      en: 'Subpoena Duces Tecum',
      hi: 'सबपोइना ड्यूसेस टेकम (दस्तावेज़ प्रस्तुति आदेश)',
      es: 'Subpoena Duces Tecum (Citación para Presentación de Documentos)',
      de: 'Subpoena Duces Tecum (Beweismittel-Vorlageanordnung)',
      fr: 'Subpoena Duces Tecum (Assignation de Pièces)',
      ja: '書面提出命令令状（Subpoena Duces Tecum）',
      zh: '文书调取令 (Subpoena Duces Tecum / 调取物证传票)'
    },
    phonetic: 'suh-PEE-nuh DOO-ses TEE-kum',
    category: 'evidence',
    plainEnglish: {
      en: 'A formal court order commanding a third party or witness to deliver physical documents, files, bank records, or electronic evidence to the court or deposition.',
      hi: 'तीसरे पक्ष या गवाह को अदालत में भौतिक दस्तावेज, बैंक रिकॉर्ड या इलेक्ट्रॉनिक साक्ष्य पेश करने का औपचारिक अदालती आदेश।',
      es: 'Una orden judicial formal que exige a un tercero o testigo presentar documentos físicos, archivos bancarios o pruebas electrónicas.',
      de: 'Gerichtliche Anordnung an Zeugen oder Dritte, bestimmte Akten, Bankbelege oder elektronische Beweismittel vorzulegen.',
      fr: 'Injonction judiciaire obligeant un tiers ou témoin à produire des documents physiques, relevés bancaires ou preuves numériques.',
      ja: '第三者や証人に対して、帳簿、銀行取引明細、電子記録などの物理的証拠の提出を命じる裁判所の正式令状。',
      zh: '法院签发的一项正式书面命令，强制要求第三方或证人向法庭或宣誓取证现场交付指定的书面文件、银行账单或电子物证。'
    },
    courtContext: {
      en: 'Essential for obtaining records from banks, employers, phone companies, or uninterested third parties.',
      hi: 'बैंकों, नियोक्ताओं, फोन कंपनियों या अनिच्छुक तीसरे पक्षों से रिकॉर्ड प्राप्त करने के लिए आवश्यक।',
      es: 'Indispensable para obtener expedientes de bancos, empleadores, operadores telefónicos o terceros ajenos al pleito.',
      de: 'Unerlässlich für die Beiziehung von Unterlagen von Banken, Arbeitgebern oder Telekommunikationsanbietern.',
      fr: 'Indispensable pour obtenir des pièces auprès des banques, employeurs ou opérateurs de télécommunications.',
      ja: '銀行、勤務先、通信会社などの利害関係のない第三者から正式な記録を取り寄せるために不可欠。',
      zh: '从银行、雇主单位、通信运营商或中立第三方调取原始流水与通话存单的关键法定手段。'
    },
    proSeTip: {
      en: 'Always allow at least 15–20 days notice before the compliance date, and serve formal notice on all parties.',
      hi: 'अनुपालन तिथि से कम से कम 15-20 दिन पहले सूचना दें, और सभी पक्षों को औपचारिक सूचना दें।',
      es: 'Conceda siempre al menos 15–20 días antes de la fecha de entrega y notifique formalmente a todas las partes personadas.',
      de: 'Gewähren Sie mindestens 15–20 Tage Frist vor dem Vorlagetermin und stellen Sie den Parteien ordnungsgemäß zu.',
      fr: 'Prévoyez un préavis d’au moins 15 à 20 jours avant la date d’exigibilité et signifiez la demande aux parties.',
      ja: '提出期日までに少なくとも15〜20日間の猶予期間を設け、全当事者に公式通知を送達してください。',
      zh: '传票指定的交付日期务必预留至少 15-20 天合理的送达与准备时间，并须向案件所有各方当事人同步送达通知。'
    },
    exampleSentence: {
      en: 'Plaintiff served a Subpoena Duces Tecum on Chase Bank demanding Defendant’s wire transfer logs from March 2025.',
      hi: 'वादी ने मार्च 2025 से प्रतिवादी के वायर ट्रांसफर लॉग की मांग करते हुए चेस बैंक को एक सबपोइना ड्यूसेस टेकम दिया।',
      es: 'El demandante notificó un Subpoena Duces Tecum a Chase Bank solicitando los registros de transferencias del demandado de marzo de 2025.',
      de: 'Die Klägerin stellte der Bank eine Beweismittelanordnung zu, um die Überweisungsprotokolle des Beklagten anzufordern.',
      fr: 'Le demandeur a signifié une assignation à produire à la banque pour obtenir les relevés de virement du défendeur.',
      ja: '原告は2025年3月の電信送金記録を求め、取引銀行に対して提出命令令状を送達した。',
      zh: '原告依法向大通银行送达了文书调取令，要求其提供被告 2025 年 3 月的电汇交易流水明细。'
    }
  },
  {
    id: 'res_judicata',
    term: {
      en: 'Res Judicata',
      hi: 'रेस ज्यूडिकाटा (प्रांग्न्याय सिद्धान्त)',
      es: 'Res Judicata (Cosa Juzgada)',
      de: 'Res Judicata (Rechtskraft / Ne bis in idem)',
      fr: 'Res Judicata (Autorité de la Chose Jugée)',
      ja: '既判力（一事不再理・Res Judicata）',
      zh: '一事不再理 (Res Judicata / 既判力)'
    },
    phonetic: 'reez joo-dih-KAY-tuh',
    category: 'latin',
    plainEnglish: {
      en: '"A matter already judged." You cannot sue someone twice over the exact same dispute once a final judgment on the merits has been entered.',
      hi: '"एक मामला जिसका पहले ही फैसला हो चुका है।" अंतिम निर्णय दर्ज होने के बाद आप उसी विवाद पर किसी पर दोबारा मुकदमा नहीं कर सकते।',
      es: '"Cosa ya juzgada." No se puede demandar a la misma persona dos veces por el idéntico conflicto una vez dictada sentencia firme sobre el fondo.',
      de: '"Eine bereits entschiedene Sache." Ist ein rechtskräftiges Sachurteil ergangen, kann derselbe Streitgegenstand nicht erneut eingeklagt werden.',
      fr: '"Une affaire déjà jugée." On ne peut pas poursuivre deux fois la même personne pour le même litige dès lors qu’un jugement définitif a été rendu.',
      ja: '「判決確定済みの事案」。本案に関する確定判決が一度下された同一の紛争について、二重に再提訴することはできません。',
      zh: '“既经审判之事项”。一旦法院就案件实体事实作出了具有终局拘束力的生效判决，任何一方均不得就同一诉由再次起诉同一当事人。'
    },
    courtContext: {
      en: 'Prevents harassment and endless litigation of claims arising out of the same underlying transaction.',
      hi: 'एक ही अंतर्निहित लेनदेन से उत्पन्न दावों के उत्पीड़न और अंतहीन मुकदमेबाजी को रोकता है।',
      es: 'Impide el acoso y los litigios interminables nacidos de la misma relación o hecho causal subyacente.',
      de: 'Verhindert Schikanen und wiederholte Klagen aus demselben Lebenssachverhalt.',
      fr: 'Empêche le harcèlement procédural et la multiplication des poursuites issues du même fait générateur.',
      ja: '同一の取引や事故から生じた請求の蒸し返しや、際限のない訴訟提起を防ぐための大原則。',
      zh: '旨在防止基于同一基础法律关系而对当事人进行无休止的诉讼骚扰，维护既判力的稳定性。'
    },
    proSeTip: {
      en: 'Make sure you include all related claims in your original lawsuit, because you cannot split them into separate future lawsuits.',
      hi: 'सुनिश्चित करें कि आप अपने मूल मुकदमे में सभी संबंधित दावों को शामिल करते हैं, क्योंकि आप उन्हें भविष्य के मुकदमों में विभाजित नहीं कर सकते।',
      es: 'Asegúrese de incluir todas sus pretensiones conexas en la demanda inicial, ya que la ley prohíbe fragmentarlas en pleitos posteriores.',
      de: 'Führen Sie alle zusammenhängenden Ansprüche in der ersten Klage auf; ein Aufspalten in Folgeprozesse ist unzulässig.',
      fr: 'Veillez à regrouper toutes vos demandes connexes dans l’instance initiale, leur scission étant interdite.',
      ja: '後から分割して別訴を提起することはできないため、関連する全請求を最初の訴状に必ず含めてください。',
      zh: '必须在首次起诉时把与该事件相关的全部诉讼请求一并提出，普通法严厉禁止就同一事实分案拆分起诉。'
    },
    exampleSentence: {
      en: 'The court dismissed the new property damage lawsuit on grounds of res judicata since the small claims court had already ruled on it.',
      hi: 'अदालत ने संपत्ति के नुकसान के नए मुकदमे को रेस ज्यूडिकाटा के आधार पर खारिज कर दिया क्योंकि छोटी अदालतों ने पहले ही इस पर फैसला सुना दिया था।',
      es: 'El tribunal desestimó la nueva demanda por daños materiales por cosa juzgada, al haberse pronunciado previamente el tribunal de cuantía menor.',
      de: 'Das Gericht wies die erneute Schadensersatzklage wegen Rechtskraft ab, da das Amtsgericht bereits darüber entschieden hatte.',
      fr: 'Le tribunal a rejeté la nouvelle action en dommages matériels au motif de la chose jugée, le juge de proximité ayant déjà tranché.',
      ja: '少額裁判所がすでに終局判断を下していたため、裁判所は既判力を根拠に新たな物損損害賠償訴訟を却下した。',
      zh: '由于小额法庭此前已经对该修缮纠纷作出终审判决，法院依据一事不再理原则裁定驳回了原告新提起的财产权损害诉讼。'
    }
  },
  {
    id: 'prima_facie_case',
    term: {
      en: 'Prima Facie Case',
      hi: 'प्राइमा फेसी केस (प्रथम दृष्टया मामला)',
      es: 'Caso Prima Facie (A Primera Vista)',
      de: 'Prima-Facie-Fall (Beweis des ersten Anscheins)',
      fr: 'Cas Prima Facie (Présomption Initiale Suffisante)',
      ja: '一応の立証（Prima Facie Case）',
      zh: '表面证据成立案件 (Prima Facie / 初步证据确凿)'
    },
    phonetic: 'PRY-muh FAY-shee',
    category: 'latin',
    plainEnglish: {
      en: '"At first sight." Presenting sufficient initial evidence to establish all mandatory legal elements of your claim, which stands as proven unless the defendant refutes it.',
      hi: '"पहली नज़र में।" आपके दावे के सभी अनिवार्य कानूनी तत्वों को स्थापित करने के लिए पर्याप्त प्रारंभिक साक्ष्य प्रस्तुत करना।',
      es: '"A primera vista." Presentar pruebas iniciales suficientes para acreditar todos los elementos legales obligatorios de la pretensión.',
      de: '"Auf den ersten Blick." Erbringung ausreichender Anfangsbeweise für alle materiellen Anspruchsvoraussetzungen.',
      fr: '"À première vue." Présentation d’éléments de preuve initiaux suffisants pour établir tous les critères légaux obligatoires.',
      ja: '「一見して明白な」。請求に必要なすべての法的要件を満たす十分な証拠を提示し、相手方が反証しない限り成立が認められる状態。',
      zh: '“一眼即可查明”。指原告提交了足以支持诉请全部法定构成要件的初步证据，在被告提出实质反证之前，该案件事实在法律上被推定成立。'
    },
    courtContext: {
      en: 'The threshold test every plaintiff must pass to avoid immediate dismissal.',
      hi: 'प्रत्येक वादी को तत्काल बर्खास्तगी से बचने के लिए पार करने वाली न्यूनतम सीमा।',
      es: 'El umbral probatorio que todo demandante debe superar para evitar la desestimación preliminar.',
      de: 'Die Mindesthürde, die jede klagende Partei nehmen muss, um eine Klageabweisung zu vermeiden.',
      fr: 'Le seuil probatoire que tout demandeur doit franchir pour éviter le rejet immédiat de sa requête.',
      ja: '審理の即時却下を免れるために、すべての原告が最初にクリアしなければならない基準。',
      zh: '每一位原告为避免起诉被法官直接驳回所必须跨越的基础举证门槛。'
    },
    proSeTip: {
      en: 'SueChef’s Claim Kitchen checks your facts against the exact prima facie requirements for your specific cause of action.',
      hi: 'SueChef का क्लेम किचन आपकी विशिष्ट कार्रवाई के लिए सटीक प्राइमा फेसी आवश्यकताओं के खिलाफ आपके तथ्यों की जांच करता है।',
      es: 'La Claim Kitchen de SueChef coteja sus hechos con los requisitos prima facie exactos de su acción legal.',
      de: 'Die Klage-Küche von SueChef prüft Ihre Tatsachen anhand der exakten Anspruchsgrundlagen.',
      fr: 'La Cuisine des Réclamations de SueChef vérifie vos faits par rapport aux exigences prima facie applicables.',
      ja: 'SueChefのクレーム・キッチンは、各訴訟原因に必要な要件事実と手持ちの証拠を照合判定します。',
      zh: 'SueChef 的“诉求厨房”会严格对照您所在案由的法定表面证据成立要件，对您的基础事实逐一进行核验。'
    },
    exampleSentence: {
      en: 'Plaintiff established a prima facie case for breach of contract by showing a valid agreement, full performance, defendant’s non-payment, and exact damages.',
      hi: 'वादी ने अनुबंध के उल्लंघन के लिए एक प्राइमा फेसी मामला स्थापित किया।',
      es: 'El actor acreditó un caso prima facie por incumplimiento contractual acreditando el contrato, su cumplimiento, el impago del demandado y los daños.',
      de: 'Der Kläger begründete einen schlüssigen Anspruch auf Vertragsverletzung durch Vorlage des Vertrags, eigener Leistung und des Zahlungsverzugs.',
      fr: 'Le demandeur a établi un cas prima facie de rupture de contrat en justifiant d’un accord valide, de sa propre exécution et du non-paiement.',
      ja: '原告は有効な契約書、自身の債務履行、被告の不払い、損害額を立証し、契約違反の一応の立証を完了した。',
      zh: '原告出示了有效合同文本、自身已履行义务的记录、被告违约未付款凭证及确切损失清单，从而完成了违约之诉的表面举证责任。'
    }
  },
  {
    id: 'motion_in_limine',
    term: {
      en: 'Motion in Limine',
      hi: 'मोशन इन लिमिने (साक्ष्य निषेध प्रस्ताव)',
      es: 'Moción in Limine (Exclusión Previa de Prueba)',
      de: 'Motion in Limine (Beweisverwertungsrüge vor Verhandlung)',
      fr: 'Motion in Limine (Demande Préliminaire d’Exclusion de Preuve)',
      ja: '証拠排除の事前申立（Motion in Limine）',
      zh: '庭前证据排除动议 (Motion in Limine)'
    },
    phonetic: 'MOH-shun in LIH-mih-nee',
    category: 'evidence',
    plainEnglish: {
      en: 'A pre-trial motion asking the judge to forbid the other party from mentioning certain prejudicial, irrelevant, or inadmissible evidence in front of the jury.',
      hi: 'मुकदमे से पहले का प्रस्ताव जिसमें न्यायाधीश से दूसरे पक्ष को जूरी के सामने कुछ पूर्वाग्रहपूर्ण या अस्वीकार्य साक्ष्य का उल्लेख करने से मना करने के लिए कहा जाता है।',
      es: 'Una moción previa al juicio solicitando al juez prohibir a la contraparte mencionar pruebas perjudiciales, irrelevantes o inadmisibles ante el jurado.',
      de: 'Ein Antrag vor der Hauptverhandlung, der Gegenseite die Erwähnung bestimmter unzulässiger oder voreingenommener Beweise zu untersagen.',
      fr: 'Une demande préalable au procès invitant le juge à interdire à la partie adverse de mentionner des preuves préjudiciables ou irrecevables devant le jury.',
      ja: '公判前に、相手方が陪審員の前で偏見を誘発する証拠や無関係・証拠能力を欠く証拠に言及することを禁じるよう裁判官に求める申立て。',
      zh: '开庭审理前提出的一项程序动议，请求法官下令禁止对方当事人在陪审团面前提及任何具有偏见性、无关紧要或不具可采性的非法证据。'
    },
    courtContext: {
      en: 'Heard right before trial begins to prevent toxic evidence from spoiling the proceedings.',
      hi: 'मुकदमा शुरू होने से ठीक पहले सुना जाता है ताकि जहरीले सबूतों को कार्यवाही खराब करने से रोका जा सके।',
      es: 'Se tramita inmediatamente antes del inicio del juicio para evitar que pruebas contaminantes vultúen el proceso.',
      de: 'Wird unmittelbar vor Verhandlungsbeginn verhandelt, um eine Beeinflussung der Geschworenen zu verhindern.',
      fr: 'Examiné juste avant le début du procès pour éviter qu’une preuve illicite ne vicie les débats.',
      ja: '不適切な証拠によって審理全体が汚染されるのを防ぐため、公判直前に審理されます。',
      zh: '在正式开庭前由法官当庭裁定，以防止不良证据对陪审团产生先入为主的不当影响。'
    },
    proSeTip: {
      en: 'Use this to block the opposing side from bringing up unrelated personal issues, prior unrelated lawsuits, or unverified hearsay.',
      hi: 'विरोधी पक्ष को असंबंधित व्यक्तिगत मुद्दों या अपुष्ट अफवाहों को उठाने से रोकने के लिए इसका उपयोग करें।',
      es: 'Utilícelo para impedir que la contraparte ventile asuntos personales ajenos, pleitos anteriores sin relación o rumores.',
      de: 'Nutzen Sie diesen Antrag, um persönliche Angriffe, irrelevante Vorprozesse oder Gerüchte vom Verfahren fernzuhalten.',
      fr: 'Utilisez-le pour bloquer les attaques personnelles hors sujet, les procès antérieurs non connexes ou les ouï-dire.',
      ja: '事件と無関係な私生活、過去の無関係な係争歴、未確認の伝聞証拠を相手方が法廷で発言するのを封じるために活用します。',
      zh: '利用此动议全面封杀对方试图翻出与本案无关的个人隐私、既往不相干纠纷或道听途说的传闻证据。'
    },
    exampleSentence: {
      en: 'Plaintiff filed a motion in limine to exclude evidence of an unrelated parking ticket from three years ago.',
      hi: 'वादी ने तीन साल पहले के एक असंबंधित पार्किंग टिकट के साक्ष्य को बाहर करने के लिए मोशन इन लिमिने दायर किया।',
      es: 'El actor promovió una moción in limine para excluir toda prueba relativa a una multa de tráfico inconexa de hace tres años.',
      de: 'Die Klägerin stellte eine Motion in Limine, um ein drei Jahre altes Parkknöllchen als Beweismittel auszuschließen.',
      fr: 'Le demandeur a déposé une motion in limine afin d’exclure une contravention de stationnement sans rapport vieille de trois ans.',
      ja: '原告は3年前の無関係な駐車違反切符に関する証拠を排除するため、証拠排除事前申立を提出した。',
      zh: '原告向法庭递交了庭前证据排除动议，请求法官依法将三年前一张与本案毫无关联的违章停车罚单排除出法庭证据。'
    }
  },
  {
    id: 'interrogatories',
    term: {
      en: 'Interrogatories',
      hi: 'लिखित प्रश्न (Interrogatories)',
      es: 'Interrogatorios Escritos (Interrogatories)',
      de: 'Schriftliche Parteifragen (Interrogatories)',
      fr: 'Interrogatoires Écrits (Interrogatories)',
      ja: '質問書（書面による証拠開示・Interrogatories）',
      zh: '书面质询书 (Interrogatories / 宣誓书面质问)'
    },
    phonetic: 'in-ter-ROG-uh-tor-eez',
    category: 'procedural',
    plainEnglish: {
      en: 'Written questions that one party sends to the other during pre-trial discovery, which must be answered truthfully in writing under oath within 30 days.',
      hi: 'लिखित प्रश्न जो एक पक्ष पूर्व-परीक्षण खोज के दौरान दूसरे को भेजता है, जिनका उत्तर 30 दिनों के भीतर शपथ के तहत लिखित में दिया जाना चाहिए।',
      es: 'Preguntas escritas que una parte traslada a la contraria durante el descubrimiento probatorio, que deben responderse bajo juramento en 30 días.',
      de: 'Schriftliche Fragen im Rahmen der Beweisermittlung, die die Gegenseite binnen 30 Tagen wahrheitsgemäß an Eides statt beantworten muss.',
      fr: 'Questions écrites adressées par une partie à l’autre pendant la phase préparatoire, devant être répondues sous serment sous 30 jours.',
      ja: '公判前の証拠開示手続きにおいて相手方に送付する書面質問。相手方は30日以内に宣誓の上、真実を書面で回答する義務があります。',
      zh: '在庭前证据开示程序中由一方向对方发出的正式书面问卷，受质询方必须在 30 天内依法经宣誓后作出具结书面如实回答。'
    },
    courtContext: {
      en: 'Standard civil discovery tool used to uncover dates, witnesses, facts, and contentions.',
      hi: 'तिथियों, गवाहों, तथ्यों और विवादों को उजागर करने के लिए मानक नागरिक खोज उपकरण।',
      es: 'Herramienta fundamental de instrucción civil utilizada para fijar fechas, testigos, hechos y pretensiones controvertidas.',
      de: 'Standardwerkzeug der vorgerichtlichen Beweissicherung zur Klärung von Daten, Zeugen und Tatsachenbehauptungen.',
      fr: 'Outil classique d’instruction civile pour identifier les dates, témoins, faits et moyens juridiques adverses.',
      ja: '日時、目撃証人、客観的事実、相手方の法的主張内容を明らかにするための標準的な民事証拠開示ツール。',
      zh: '普通法系民事诉讼标准取证程序，用于锁定关键发生日期、在场证人、基础事实和各自主张焦点。'
    },
    proSeTip: {
      en: 'Most jurisdictions cap interrogatories at 25–35 questions without court permission. Keep each question focused.',
      hi: 'अधिकांश क्षेत्राधिकार अदालत की अनुमति के बिना 25-35 प्रश्नों तक सीमित करते हैं। प्रत्येक प्रश्न को केंद्रित रखें।',
      es: 'La mayoría de jurisdicciones limitan las preguntas a 25–35 sin autorización judicial previa. Redacte cada pregunta con máxima precisión.',
      de: 'Die meisten Gerichte beschränken unzulassungsfreie Fragen auf 25–35 Fragen. Formulieren Sie präzise.',
      fr: 'La plupart des juridictions limitent les questions à 25–35 sans autorisation préalable du tribunal. Soyez très concis.',
      ja: '裁判所の許可がない限り、通常25〜35問の上限が設けられています。1問につき1つの事実に絞って質問を作成してください。',
      zh: '若无法院特别裁定许可，多数法院限制单次质询数量在 25-35 题以内。提问切忌复杂冗长，须一事一问。'
    },
    exampleSentence: {
      en: 'In Interrogatory No. 4, Plaintiff requested the exact date Defendant inspected the premises before withholding the deposit.',
      hi: 'प्रश्न संख्या 4 में, वादी ने उस सटीक तारीख का अनुरोध किया जिस दिन प्रतिवादी ने जमा राशि रोकने से पहले परिसर का निरीक्षण किया था।',
      es: 'En la Pregunta Escrita n.º 4, el actor requirió la fecha exacta en que el demandado inspeccionó la vivienda antes de retener la fianza.',
      de: 'In Frage Nr. 4 verlangte die Klägerin das genaue Datum, an dem der Beklagte die Räume vor Einbehalt der Kaution besichtigt hatte.',
      fr: 'Dans l’interrogatoire n° 4, le demandeur a exigé la date exacte de l’état des lieux avant la retenue du dépôt de garantie.',
      ja: '書面質問第4項において、原告は被告が敷金を差し控える前に物件の点検を実施した正確な日時を求めた。',
      zh: '在第 4 号书面质询中，原告要求被告明确写明其在扣押房屋押金前对涉案房产进行实地查验的具体日期。'
    }
  },
  {
    id: 'rfp',
    term: {
      en: 'Requests for Production of Documents (RFP)',
      hi: 'दस्तावेज़ उत्पादन के लिए अनुरोध (RFP)',
      es: 'Requerimiento de Exhibición de Documentos (RFP)',
      de: 'Urkundenvorlageverlangen (RFP)',
      fr: 'Demande de Production de Pièces (RFP)',
      ja: '文書提出要求（Requests for Production - RFP）',
      zh: '调取书证文件请求 (RFP / 证据开示调档要求)'
    },
    phonetic: 'rih-KWESTS for proh-DUK-shun',
    category: 'evidence',
    plainEnglish: {
      en: 'A formal discovery demand requiring the opposing party to produce original copies of emails, contracts, text messages, receipts, and electronic records.',
      hi: 'विरोधी पक्ष को ईमेल, अनुबंध, टेक्स्ट संदेश, रसीदें और इलेक्ट्रॉनिक रिकॉर्ड की मूल प्रतियां पेश करने की औपचारिक मांग।',
      es: 'Una exigencia formal de prueba que obliga a la contraparte a aportar copias de correos, contratos, mensajes, facturas y registros digitales.',
      de: 'Ein formelles Vorlageverlangen, das die Gegenseite verpflichtet, Kopien von E-Mails, Verträgen, SMS und Buchungsbelegen vorzulegen.',
      fr: 'Une demande officielle exigeant que la partie adverse produise copies de ses e-mails, contrats, SMS, factures et fichiers.',
      ja: '電子メール、契約書、テキストメッセージ、領収書、電磁的記録などの提出を相手方に義務付ける正式な証拠開示要求。',
      zh: '一项正式开示程序要求，强制令对方当事人向己方提供指定电子邮件、合同原件、即时通信聊天记录、支付收据及电子档案副本。'
    },
    courtContext: {
      en: 'Governed by FRCP Rule 34 or state civil discovery acts.',
      hi: 'FRCP नियम 34 या राज्य नागरिक खोज अधिनियमों द्वारा शासित।',
      es: 'Regulado por la Regla 34 de las FRCP o las leyes procesales de descubrimiento probatorio estatales.',
      de: 'Geregelt nach FRCP Rule 34 oder bundesstaatlichen Zivilprozessordnungen.',
      fr: 'Régie par la règle 34 des FRCP ou les codes de procédure civile des États.',
      ja: '連邦民事訴訟規則第34条または各州の証拠開示法によって規律されます。',
      zh: '依据《联邦民事诉讼规则》第 34 条或各州民事证据开示法执行。'
    },
    proSeTip: {
      en: 'Be specific in what you ask for (e.g. "All email correspondence between Party A and Party B between Jan 1 and March 1, 2025").',
      hi: 'आप जो मांगते हैं उसमें विशिष्ट रहें (उदा. "1 जनवरी और 1 मार्च, 2025 के बीच पार्टी ए और पार्टी बी के बीच सभी ईमेल पत्राचार")।',
      es: 'Sea muy específico en su requerimiento (p. ej., "Toda la correspondencia por email entre la Parte A y B entre el 1 de enero y el 1 de marzo de 2025").',
      de: 'Formulieren Sie konkrete Anforderungen (z.B. "Sämtlicher E-Mail-Verkehr zwischen Partei A und B im Zeitraum 1. Jan. bis 1. März 2025").',
      fr: 'Soyez précis dans votre demande (ex. : "Tous les courriels échangés entre la partie A et la partie B du 1er janv. au 1er mars 2025").',
      ja: '「2025年1月1日から3月1日までの間の当事者AとBの間の全電子メール送受信履歴」など、範囲を厳密に特定して請求してください。',
      zh: '所请求调取的文件范围必须明确具体（例如：“2025年1月1日至3月1日期间甲乙双方之间的全部往来电子邮件”）。'
    },
    exampleSentence: {
      en: 'Defendant failed to respond to RFP No. 12, which sought the repair invoices for the alleged drywall damage.',
      hi: 'प्रतिवादी आरएफपी नंबर 12 का जवाब देने में विफल रहा, जिसमें कथित ड्राईवॉल क्षति के लिए मरम्मत चालान मांगे गए थे।',
      es: 'El demandado no respondió al Requerimiento n.º 12, que solicitaba las facturas de reparación de los daños alegados en la tabiquería.',
      de: 'Der Beklagte versäumte die Beantwortung der Anforderung Nr. 12, mit der die Reparaturrechnungen für den Trockenbauschaden angefordert wurden.',
      fr: 'Le défendeur n’a pas répondu à la demande n° 12 visant les factures de réparation des cloisons endommagées.',
      ja: '被告は壁紙修繕費用の請求書開示を求めたRFP第12項に対する回答を怠った。',
      zh: '被告未能针对第 12 号调档请求作出响应，该请求要求其出示所谓石膏墙面受损的实际维修发票。'
    }
  },
  {
    id: 'rfa',
    term: {
      en: 'Requests for Admission (RFA)',
      hi: 'स्वीकृति के लिए अनुरोध (RFA)',
      es: 'Requerimiento de Admisión de Hechos (RFA)',
      de: 'Tatsachen-Anerkenntnisverlangen (RFA)',
      fr: 'Demande d’Admission de Faits (RFA)',
      ja: '自白要求（Requests for Admission - RFA）',
      zh: '自认请求书 (RFA / 事实确认与证据真实性自认)'
    },
    phonetic: 'rih-KWESTS for ad-MISH-un',
    category: 'procedural',
    plainEnglish: {
      en: 'Written statements sent to the other party asking them to admit or deny specific facts or verify the authenticity of key documents under oath.',
      hi: 'दूसरे पक्ष को भेजे गए लिखित बयान जिसमें उनसे विशिष्ट तथ्यों को स्वीकार या अस्वीकार करने के लिए कहा गया है।',
      es: 'Manifestaciones escritas remitidas a la contraparte exigiéndole admitir o negar hechos concretos o reconocer la autenticidad de documentos.',
      de: 'Schriftliche Feststellungen, die der Gegenseite zur Bestätigung oder Bestreitung unter Eid vorgelegt werden.',
      fr: 'Déclarations écrites enjoignant la partie adverse d’admettre ou nier des faits précis ou d’authentifier des pièces sous serment.',
      ja: '特定事実の真否の自白または主要文書の真正性確認を相手方に書面で求める手続き。',
      zh: '向对方当事人送达的书面陈述清单，要求其经宣誓后逐项明确予以“认可自认”或“否认辩驳”，或确认核心证据的真实性。'
    },
    courtContext: {
      en: 'If the opposing party fails to answer within 30 days, the statements are automatically deemed ADMITTED as true for the entire case!',
      hi: 'यदि विरोधी पक्ष 30 दिनों के भीतर उत्तर देने में विफल रहता है, तो बयानों को स्वचालित रूप से पूरे मामले के लिए सच मान लिया जाता है!',
      es: 'Si la contraparte no contesta en el plazo de 30 días, ¡los hechos se tienen AUTOMÁTICAMENTE POR ADMITIDOS y ciertos para todo el pleito!',
      de: 'Antwortet die Gegenseite nicht innerhalb von 30 Tagen, gelten die Tatsachen kraft Gesetzes für das gesamte Verfahren als ZUGESTANDEN!',
      fr: 'À défaut de réponse sous 30 jours, les faits sont automatiquement RÉPUTÉS ADMIS comme vrais pour l’ensemble de l’instance !',
      ja: '相手方が30日以内に回答しない場合、すべての記述が訴訟全体を通じて「真実として自白されたもの（Deemed Admitted）」とみなされます！',
      zh: '若对方在收到后 30 天内逾期未作答复，根据民诉规则，该清单上的全部事实将依法直接被推定为【已自认成立】并拘束整场诉讼！'
    },
    proSeTip: {
      en: 'RFAs are one of the most devastating procedural weapons in civil litigation. Missing the 30-day deadline is fatal to a defendant.',
      hi: 'आरएफए नागरिक मुकदमेबाजी में सबसे विनाशकारी हथियारों में से एक हैं। 30-दिन की समय सीमा को छोड़ना प्रतिवादी के लिए घातक है।',
      es: 'Los RFA son un arma procesal devastadora. Dejar vencer el plazo de 30 días resulta fatal para la defensa del demandado.',
      de: 'RFAs sind eines der wirksamsten verfahrensrechtlichen Druckmittel. Das Verpassen der 30-Tage-Frist ist für Beklagte oft fatal.',
      fr: 'Les RFA constituent une arme procédurale redoutable. Le dépassement du délai de 30 jours est fatal pour un défendeur.',
      ja: 'RFAは民事訴訟で最も強力な手続き上の手段の一つです。30日の回答期日を徒過することは被告にとって致命傷となります。',
      zh: '自认请求书是普通法系中最具杀伤力的程序利器。一旦被告错过 30 天的答辩截止期，案件败局基本锁定。'
    },
    exampleSentence: {
      en: 'By failing to answer Plaintiff’s RFA No. 1 within 30 days, Defendant admitted under law that they signed the lease agreement.',
      hi: '30 दिनों के भीतर वादी के RFA नंबर 1 का जवाब देने में विफल रहने पर, प्रतिवादी ने कानून के तहत स्वीकार किया कि उन्होंने पट्टा समझौते पर हस्ताक्षर किए थे।',
      es: 'Al no responder al RFA n.º 1 en 30 días, el demandado admitió legalmente por confeso haber suscrito el contrato de arrendamiento.',
      de: 'Durch Fristversäumnis bei RFA Nr. 1 galt als rechtlich zugestanden, dass der Beklagte den Mietvertrag unterschrieben hatte.',
      fr: 'Faute de réponse au RFA n° 1 sous 30 jours, le défendeur est réputé avoir admis légalement avoir signé le bail.',
      ja: '30日以内に原告のRFA第1項に回答しなかったため、被告は賃貸借契約書に署名した事実を法律上自白した扱いとなった。',
      zh: '由于被告未能在 30 天内回答原告的第 1 号自认请求，法庭依法直接认定被告签字签署该租赁协议的事实已成立。'
    }
  },
  {
    id: 'hearsay',
    term: {
      en: 'Hearsay (FRE Rule 801/802)',
      hi: 'सुनी-सुनाई बातें (FRE नियम 801/802)',
      es: 'Testimonio de Referencia / Hearsay (FRE Regla 801/802)',
      de: 'Zeugnis vom Hörensagen (FRE Rule 801/802)',
      fr: 'Témoignage par Ouï-Dire (FRE Règle 801/802)',
      ja: '伝聞証拠の禁止（連邦証拠規則第801/802条）',
      zh: '传闻证据排除规则 (FRE 规则 801/802)'
    },
    phonetic: 'HEER-say',
    category: 'evidence',
    plainEnglish: {
      en: 'An out-of-court statement offered in court to prove the truth of the matter asserted. Generally NOT admissible unless a specific legal exception applies.',
      hi: 'अदालत के बाहर दिया गया बयान जो अदालत में उस बात की सच्चाई साबित करने के लिए पेश किया जाता है। आम तौर पर स्वीकार्य नहीं है।',
      es: 'Una declaración extrajudicial presentada en el juicio para acreditar la veracidad de lo afirmado. Por regla general es INADMISIBLE salvo excepción tasada.',
      de: 'Eine außergerichtliche Aussage, die vor Gericht zum Beweis ihrer inhaltlichen Wahrheit vorgelegt wird. Grundsätzlich UNZULÄSSIG ohne Ausnahme.',
      fr: 'Une déclaration faite hors du tribunal et invoquée pour prouver la véracité des faits allégués. En règle générale NON RECEVABLE sans exception.',
      ja: '法廷外での供述を、その内容の真実性を証明するために法廷に提出する証拠。例外規定に該当しない限り原則として証拠能力を欠きます。',
      zh: '在法庭之外作出的陈述被提交到法庭用以证明其所主张的事实本身具有真实性。除非符合明确的法定例外，否则原则上一律不可采信。'
    },
    courtContext: {
      en: 'Testifying "Bob told me that Sarah took the money" is inadmissible hearsay to prove Sarah took it.',
      hi: 'यह गवाही देना कि "बॉब ने मुझे बताया कि सारा ने पैसे लिए थे" सारा द्वारा पैसे लेने को साबित करने के लिए अस्वीकार्य है।',
      es: 'Declarar "Bob me dijo que Sara cogió el dinero" constituye testimonio de referencia inadmisible para probar que Sara lo tomó.',
      de: 'Die Aussage "Bob erzählte mir, dass Sarah das Geld genommen habe" ist als Beweis unzulässiges Hörensagen.',
      fr: 'Déclarer "Bob m’a dit que Sarah avait pris l’argent" constitue un ouï-dire irrecevable pour prouver le vol de Sarah.',
      ja: '「ボブがサラはお金を盗んだと言っていた」と証言しても、サラの窃盗を立証する証拠としては採用されません。',
      zh: '当庭作证称“鲍勃告诉我莎拉拿了钱”属于典型的传闻证据，法庭绝不采纳用以证明莎拉拿钱。'
    },
    proSeTip: {
      en: 'Key exceptions you can use: (1) Admissions by the opposing party; (2) Business records kept in regular course of business; (3) Present sense impression.',
      hi: 'प्रमुख अपवाद: (1) विरोधी पक्ष द्वारा स्वीकारोक्ति; (2) नियमित व्यापारिक रिकॉर्ड; (3) वर्तमान संवेदी धारणा।',
      es: 'Excepciones clave utilizables: (1) Reconocimiento de la contraparte; (2) Registros mercantiles ordinarios; (3) Impresión sensorial coetánea.',
      de: 'Wesentliche Ausnahmen: (1) Erklärungen des Prozessgegners; (2) Gewöhnliche Geschäftsbücher; (3) Spontane Äußerungen.',
      fr: 'Exceptions majeures : (1) Aveu de la partie adverse ; (2) Pièces comptables régulières ; (3) Constatations spontanées contemporaines.',
      ja: '活用できる主な例外：(1) 相手方当事者の自白・承認、(2) 通常の業務記録、(3) 現場での即時印象供述。',
      zh: '可利用的重要法定例外：(1) 对方当事人的自认陈述；(2) 商业运作中日常保存的业务账簿记录；(3) 正在发生时当下的直观感应记录。'
    },
    exampleSentence: {
      en: 'The landlord’s letter claiming a plumber said the pipes were old was inadmissible hearsay without an affidavit from the plumber.',
      hi: 'मकान मालिक का यह दावा करने वाला पत्र कि एक प्लंबर ने कहा था कि पाइप पुराने थे, प्लंबर के हलफनामे के बिना अस्वीकार्य था।',
      es: 'La carta del casero afirmando que un fontanero dijo que las tuberías eran viejas se consideró testimonio de referencia inadmisible.',
      de: 'Das Vermieterschreiben über angebliche Aussagen eines Klempners war ohne dessen eidesstattliche Versicherung unzulässiges Hörensagen.',
      fr: 'Le courrier du bailleur affirmant qu’un plombier jugeait la tuyauterie vétuste a été rejeté comme ouï-dire en l’absence d’attestation du plombier.',
      ja: '配管工がパイプの老朽化を指摘したとする賃貸人の手紙は、配管工本人の宣誓供述書がないため伝聞証拠として排除された。',
      zh: '房东信函中声称管道工曾断言水管已老化，由于缺乏该管道工出具的经宣誓书面证言，被法官裁定为不可采的传闻证据。'
    }
  },
  {
    id: 'spoliation',
    term: {
      en: 'Spoliation of Evidence',
      hi: 'साक्ष्य का विनाश (Spoliation)',
      es: 'Destrucción / Expolio de Pruebas (Spoliation)',
      de: 'Beweismittelvereitelung (Spoliation of Evidence)',
      fr: 'Dépérissement / Destruction de Preuves (Spoliation)',
      ja: '証拠の滅失・隠滅（Spoliation of Evidence）',
      zh: '证据灭失与毁灭 (Spoliation / 恶意毁损证据责任)'
    },
    phonetic: 'spoh-lee-AY-shun',
    category: 'evidence',
    plainEnglish: {
      en: 'The intentional, reckless, or negligent destruction, alteration, or hiding of evidence relevant to an ongoing or anticipated legal dispute.',
      hi: 'चल रहे या प्रत्याशित कानूनी विवाद से संबंधित साक्ष्य का जानबूझकर, लापरवाह या उपेक्षापूर्ण विनाश या छुपाना।',
      es: 'La destrucción, alteración u ocultación intencionada o negligente de pruebas relevantes para un litigio en curso o previsible.',
      de: 'Die vorsätzliche oder fahrlässige Vernichtung, Veränderung oder Unterdrückung von Beweismitteln eines Rechtsstreits.',
      fr: 'La destruction, l’altération ou la dissimulation fautive de preuves pertinentes relatives à un litige en cours ou prévisible.',
      ja: '係争中または将来予想される法的紛争に関連する重要証拠を、故意または過失により破棄・改ざん・隠匿すること。',
      zh: '指在诉讼过程中或预见到诉讼即将发生时，故意、轻率或过失销毁、篡改、隐匿与本案具有关联性的关键物证或电子数据。'
    },
    courtContext: {
      en: 'Courts impose severe sanctions, including striking defenses or instructing the jury to assume the destroyed evidence would have proved guilt.',
      hi: 'अदालतें गंभीर प्रतिबंध लगाती हैं, जिसमें बचाव को रद्द करना या जूरी को यह निर्देश देना शामिल है कि नष्ट किए गए सबूत दोष साबित करते।',
      es: 'Los tribunales imponen duras sanciones, como anular excepciones o instruir al jurado a presumir que la prueba destruida perjudicaba al infractor.',
      de: 'Gerichte verhängen schwere Sanktionen, bis hin zum Ausschluss von Einreden oder nachteiligen Beweiswürdigungen zu Lasten des Zerstörers.',
      fr: 'Les tribunaux prononcent de lourdes sanctions, comme le rejet des défenses ou la présomption légale en défaveur de l’auteur de la destruction.',
      ja: '裁判所は抗弁の却下や、破棄された証拠が有罪・不法行為を証明していたものと推定する厳しい制裁を科します。',
      zh: '法庭会对毁证方处以极其严厉的诉讼制裁，包括直接剥夺其抗辩权，或向陪审团作出毁灭证据对其构成不利推定之指示。'
    },
    proSeTip: {
      en: 'Send a formal "Litigation Hold / Evidence Preservation Letter" immediately upon a dispute to lock in spoliation penalties if they delete text messages.',
      hi: 'यदि वे टेक्स्ट संदेश हटाते हैं तो साक्ष्य विनाश दंड को लागू करने के लिए विवाद पर तुरंत औपचारिक "सबूत संरक्षण पत्र" भेजें।',
      es: 'Remita de inmediato una "Carta de Conservación de Pruebas" al estallar la disputa para blindar las sanciones si borran mensajes.',
      de: 'Senden Sie bei Streitigkeiten sofort eine formelle Beweissicherungsaufforderung ("Litigation Hold"), um Sanktionen auszulösen.',
      fr: 'Adressez d’emblée une lettre formelle de conservation des preuves ("Litigation Hold") pour bloquer les suppressions de SMS.',
      ja: '紛争発生後直ちに「証拠保全通知書（Litigation Hold Letter）」を送付し、相手方が通信記録を消去した場合に制裁を科せるよう手配します。',
      zh: '一旦纠纷产生，必须第一时间通过可留痕方式向对方送达正式《诉讼证据保全通知函 (Litigation Hold)》，封锁其删除聊天记录的退路。'
    },
    exampleSentence: {
      en: 'Because Defendant deleted all company emails after receiving the Demand Letter, the judge entered a spoliation sanction.',
      hi: 'क्योंकि प्रतिवादी ने मांग पत्र प्राप्त करने के बाद सभी कंपनी ईमेल हटा दिए थे, न्यायाधीश ने साक्ष्य विनाश प्रतिबंध लगाया।',
      es: 'Dado que el demandado borró todos los emails corporativos tras recibir la Carta de Reclamación, el juez impuso una sanción por expolio de pruebas.',
      de: 'Weil der Beklagte nach Erhalt der Mahnung E-Mails gelöscht hatte, verhängte das Gericht eine Sanktion wegen Beweisvereitelung.',
      fr: 'Le défendeur ayant supprimé les courriels après réception de la mise en demeure, le juge a ordonné une sanction pour destruction de preuves.',
      ja: '被告が督促状受領後に社内電子メールを全消去したため、裁判官は証拠隠滅に対する制裁命令を下した。',
      zh: '鉴于被告在收到正式催告函后删除了所有企业往来邮件，主审法官直接裁定对其施加严重的毁灭证据惩戒。'
    }
  },
  {
    id: 'quantum_meruit',
    term: {
      en: 'Quantum Meruit',
      hi: 'क्वांटम मेरिट (उचित पारिश्रमिक)',
      es: 'Quantum Meruit (Tanto Cuanto Mereció)',
      de: 'Quantum Meruit (Angemessene Vergütung / Bereicherungsanspruch)',
      fr: 'Quantum Meruit (Rémunération Équitable à la Valeur Réelle)',
      ja: '相当報酬請求権（Quantum Meruit）',
      zh: '不当得利之合理对价 (Quantum Meruit / 按实际劳务价值索赔)'
    },
    phonetic: 'KWAN-tum MAIR-oo-it',
    category: 'latin',
    plainEnglish: {
      en: '"As much as he has deserved." A legal claim for reasonable payment for services rendered or goods delivered when no formal written contract exists.',
      hi: '"जितना वह हकदार है।" औपचारिक लिखित अनुबंध मौजूद न होने पर दी गई सेवाओं या सामानों के लिए उचित भुगतान का दावा।',
      es: '"Tanto cuanto mereció." Acción legal para reclamar una remuneración razonable por servicios prestados o bienes entregados a falta de contrato formal escrito.',
      de: '"So viel er verdient hat." Gesetzlicher Anspruch auf angemessene Vergütung erbrachter Leistungen ohne formgültigen schriftlichen Vertrag.',
      fr: '"Autant qu’il a mérité." Action en paiement équitable pour services rendus ou biens livrés en l’absence de contrat écrit formalisé.',
      ja: '「相当な対価の請求」。正式な書面契約が存在しない場合であっても、提供された労務や給付に対して妥当な報酬の支払いを求める衡平法上の請求。',
      zh: '“按劳取酬所得”。在双方未订立完备书面正式合同的情形下，依衡平法原理就已交付的货物或已实际提供的劳务主张公平合理报酬。'
    },
    courtContext: {
      en: 'Equitable doctrine preventing one party from receiving valuable labor or materials for free.',
      hi: 'न्यायसंगत सिद्धांत जो एक पक्ष को मुफ्त में मूल्यवान श्रम या सामग्री प्राप्त करने से रोकता है।',
      es: 'Doctrina de equidad para impedir que una parte se beneficie gratuitamente del trabajo o materiales ajenos.',
      de: 'Billigkeitsrechtlicher Grundsatz gegen ungerechtfertigte Bereicherung durch unentgeltliche Inanspruchnahme von Arbeitsleistung.',
      fr: 'Principe d’équité empêchant une partie de s’enrichir sans cause en bénéficiant de prestations gratuites.',
      ja: '一方が他方の労務や資材を無償で不当に利得することを禁じる衡平法理。',
      zh: '防止一方无偿占有另一方付出之劳动、工时与材料成果的普通法准合同原则。'
    },
    proSeTip: {
      en: 'Document market rates, hours worked, and invoices to prove the reasonable value of your services.',
      hi: 'अपनी सेवाओं के उचित मूल्य को साबित करने के लिए बाजार दरों, काम के घंटों और इनवॉइस का दस्तावेजीकरण करें।',
      es: 'Documente las tarifas habituales de mercado, horas dedicadas y facturas proforma para probar el valor razonable.',
      de: 'Dokumentieren Sie Marktpreise, geleistete Stunden und Zwischenrechnungen als Beleg für die Angemessenheit.',
      fr: 'Consignez les tarifs du marché, heures travaillées et devis pour justifier de la valeur raisonnable des prestations.',
      ja: '相場価格、作業時間記録、請求書を細かく記録し、提供した労務の客観的価値を立証してください。',
      zh: '详尽记录同行业市场公允报价、实际工时打卡及各项发票物料明细，以充分证明您所提供服务的客观合理价值。'
    },
    exampleSentence: {
      en: 'Even though the homeowner refused to sign the written contract, the contractor recovered $4,500 under quantum meruit for completed plumbing.',
      hi: 'भले ही मकान मालिक ने लिखित अनुबंध पर हस्ताक्षर करने से इनकार कर दिया, ठेकेदार ने पूरा नलसाजी कार्य के लिए क्वांटम मेरिट के तहत $4,500 वसूल किए।',
      es: 'Aunque el propietario se negó a firmar el contrato, el contratista recuperó 4.500 $ por quantum meruit por la fontanería completada.',
      de: 'Obwohl kein schriftlicher Vertrag vorlag, sprach das Gericht dem Handwerker 4.500 $ angemessenen Werklohn zu.',
      fr: 'Bien que le propriétaire ait refusé de signer le devis, l’artisan a recouvré 4 500 $ sous l’action en quantum meruit pour la plomberie réalisée.',
      ja: '施主が書面への署名を拒否していたにもかかわらず、配管工は完了した工事に対し相当報酬法理に基づき4,500ドルを回収した。',
      zh: '尽管房东事后拒绝在正式合同上签字，承包商依然依据合理报酬法理成功追回了已完工管道工程的 4,500 美元劳务费用。'
    }
  },
  {
    id: 'lis_pendens',
    term: {
      en: 'Lis Pendens',
      hi: 'लिस पेंडेंस (लंबित मुकदमा सूचना)',
      es: 'Lis Pendens (Anotación Preventiva de Demanda)',
      de: 'Lis Pendens (Streitanhängigkeitsvermerk im Grundbuch)',
      fr: 'Lis Pendens (Avis de Litige Pendant)',
      ja: '係争通知登記（Lis Pendens）',
      zh: '不动产诉讼系属通知 (Lis Pendens / 涉诉预告登记)'
    },
    phonetic: 'lis PEN-denz',
    category: 'latin',
    plainEnglish: {
      en: '"Litigation pending." A formal written notice recorded on the public land title records warning everyone that title or ownership of real property is in litigation.',
      hi: '"मुकदमा लंबित है।" सार्वजनिक भूमि शीर्षक रिकॉर्ड पर दर्ज एक औपचारिक लिखित नोटिस जो चेतावनी देता है कि संपत्ति का स्वामित्व मुकदमेबाजी में है।',
      es: '"Pleito pendiente." Anotación registral oficial que advierte a terceros adquirentes de que la titularidad o derechos sobre un inmueble están en litigio.',
      de: '"Rechtsstreit anhängig." Formelle Eintragung im Grundbuch, die davor warnt, dass das Eigentum an einer Immobilie streitig ist.',
      fr: '"Litige en cours." Avis formel inscrit aux registres fonciers avertissant les tiers que la propriété d’un bien fait l’objet d’un procès.',
      ja: '「訴訟係属中」。不動産の所有権や権利関係が裁判で争われていることを公的に警告するため、不動産登記簿に登録する公式通知。',
      zh: '“诉讼系属中”。在不动产权属登记簿上登记的正式书面公告，向所有潜在买家与抵押权人警示该不动产权属正处于司法诉讼争议中。'
    },
    courtContext: {
      en: 'Effectively freezes the property because banks will not issue mortgages and buyers will not purchase tainted title.',
      hi: 'संपत्ति को प्रभावी रूप से फ्रीज कर देता है क्योंकि बैंक बंधक जारी नहीं करेंगे और खरीदार दूषित संपत्ति नहीं खरीदेंगे।',
      es: 'Bloquea de facto el inmueble, ya que los bancos deniegan hipotecas y los compradores no adquieren títulos litigiosos.',
      de: 'Friert die Immobilie praktisch ein, da Banken keine Grundschulden bewilligen und Käufer belastete Titel meiden.',
      fr: 'Gèle efficacement le bien, les banques refusant les hypothèques et les acquéreurs évitant les titres litigieux.',
      ja: '金融機関が融資を拒否し買主も権利関係に瑕疵のある物件の購入を敬遠するため、実質的に売却を凍結させます。',
      zh: '使涉案房产事实处于流转冻结状态，因为任何商业银行均不会为产权存疑房产批贷，理性买家亦会止步。'
    },
    proSeTip: {
      en: 'Only use if your lawsuit directly affects real property title or possession, not for simple money debt disputes.',
      hi: 'केवल तभी उपयोग करें जब आपका मुकदमा सीधे संपत्ति के शीर्षक या कब्जे को प्रभावित करता है, साधारण पैसे के विवाद के लिए नहीं।',
      es: 'Utilícelo únicamente si su litigio afecta directamente al título o posesión del inmueble; jamás para simples deudas pecuniarias.',
      de: 'Nur anwendbar, wenn dingliche Rechte am Grundstück Streitgegenstand sind; unzulässig bei reinen Geldforderungen.',
      fr: 'À utiliser uniquement si l’action porte sur la propriété ou la possession réelle, jamais pour une simple créance d’argent.',
      ja: '金銭債権の請求ではなく、不動産の所有権や占有権そのものに直結する訴訟である場合にのみ使用してください。',
      zh: '仅在诉讼直接涉及不动产权属更名或物权归属时方可使用，切勿滥用于普通金钱债权债务纠纷。'
    },
    exampleSentence: {
      en: 'Plaintiff recorded a Lis Pendens on the condominium upon filing the specific performance lawsuit to enforce the purchase contract.',
      hi: 'वादी ने खरीद अनुबंध को लागू करने के लिए विशिष्ट प्रदर्शन मुकदमा दायर करने पर कोंडोमिनियम पर एक लिस पेंडेंस दर्ज किया।',
      es: 'El comprador inscribió una anotación preventiva de demanda (Lis Pendens) sobre el piso al instar el cumplimiento forzoso del contrato de compraventa.',
      de: 'Der Kläger ließ einen Streitanhängigkeitsvermerk eintragen, als er auf Erfüllung des Immobilienkaufvertrags klagte.',
      fr: 'L’acquéreur a publié un avis de lis pendens sur le logement lors du dépôt de l’action en exécution forcée de la vente.',
      ja: '原告は売買契約の履行を求める訴訟の提起に伴い、分譲マンションに係争通知登記（Lis Pendens）を記録した。',
      zh: '原告在提起强制履行房产购销合同之诉的同时，依法在不动产登记局对涉案公寓办理了涉诉预告登记。'
    }
  },
  {
    id: 'prayer_for_relief',
    term: {
      en: 'Prayer for Relief',
      hi: 'राहत के लिए प्रार्थना (Prayer for Relief)',
      es: 'Suplico / Petitorio de la Demanda (Prayer for Relief)',
      de: 'Klageantrag (Prayer for Relief)',
      fr: 'Dispositif des Demandes (Prayer for Relief)',
      ja: '請求の趣旨（Prayer for Relief）',
      zh: '诉讼请求事项 (Prayer for Relief / 判令请求)'
    },
    phonetic: 'PRAY-er for rih-LEEF',
    category: 'procedural',
    plainEnglish: {
      en: 'The concluding section of a legal complaint explicitly listing the exact money damages, court costs, interest, and court orders the plaintiff asks the judge to award.',
      hi: 'कानूनी शिकायत का अंतिम खंड जिसमें स्पष्ट रूप से सटीक धन क्षति, अदालती लागत और आदेशों को सूचीबद्ध किया गया है।',
      es: 'Sección final del escrito de demanda donde se solicita con precisión la condena dineraria, costas procesales, intereses y mandatos judiciales.',
      de: 'Der Schlussteil der Klageschrift, der die exakten Zahlungsanträge, Zinsen, Kosten und Unterlassungsgebote auflistet.',
      fr: 'Partie finale de l’assignation formulant avec précision les condamnations pécuniaires, dépens, intérêts et mesures sollicités.',
      ja: '原告が裁判所に対して認容を求める具体的な損害賠償額、遅延損害金、訴訟費用負担、各種命令を明記した訴状の結びの条項。',
      zh: '起诉状的终局请求部分，逐项写明原告请求法官依法判令被告向其赔偿的具体金额、诉讼费用负担、法定利息及具体作为或不作为命令。'
    },
    courtContext: {
      en: 'A court generally cannot award relief you never asked for in your prayer.',
      hi: 'एक अदालत आम तौर पर ऐसी राहत नहीं दे सकती जो आपने अपनी प्रार्थना में कभी नहीं मांगी थी।',
      es: 'El tribunal no puede conceder pronunciamientos o indemnizaciones no solicitadas expresamente en el suplico.',
      de: 'Das Gericht darf einer Partei nicht mehr oder anderes zusprechen, als im Klageantrag begehrt wurde.',
      fr: 'Le juge ne peut accorder plus ou autre chose que ce qui a été expressément demandé au dispositif.',
      ja: '裁判所は原則として、請求の趣旨に明記されていない救済や判決を与えることはできません。',
      zh: '民事诉讼遵循“不告不理”原则，法院一般无权主动判令未在诉讼请求中明确主张的救济项目。'
    },
    proSeTip: {
      en: 'Always include: (1) Direct damages; (2) Pre- and post-judgment statutory interest; (3) Court filing and service costs; and (4) "Such other and further relief as the Court deems just and proper."',
      hi: 'हमेशा शामिल करें: (1) प्रत्यक्ष नुकसान; (2) वैधानिक ब्याज; (3) अदालती लागत; और (4) "अदालत द्वारा उचित समझी जाने वाली अन्य राहत।"',
      es: 'Incluya siempre: (1) Daños directos; (2) Intereses legales previos y posteriores al fallo; (3) Costas y gastos de notificación; y (4) Clausula de demás peticiones justas.',
      de: 'Beantragen Sie stets: (1) Hauptforderung; (2) Zinsen ab Rechtshängigkeit; (3) Verfahrens- und Zustellkosten; (4) Kostenentscheidung.',
      fr: 'Mentionnez toujours : (1) Dommages directs ; (2) Intérêts légaux moratoires ; (3) Dépens et frais de signification ; (4) Formule de réserve d’usage.',
      ja: '必ず次の項目を含めてください：(1) 直接損害額、(2) 判決前後の法定遅延損害金、(3) 印紙代および送達費用、(4) その他裁判所が正当と認める救済。',
      zh: '务必列全：(1) 直接经济损失；(2) 判决前后法定利息；(3) 起诉规费与送达费用；(4) “以及法庭依法认为合理公道之其他救济”。'
    },
    exampleSentence: {
      en: 'In the Prayer for Relief, Plaintiff requested $3,200 in return of deposit, $6,400 in statutory bad faith penalties, and $185 in court filing fees.',
      hi: 'राहत के लिए प्रार्थना में, वादी ने $3,200 जमा वापसी, $6,400 वैधानिक दंड और $185 फाइलिंग शुल्क का अनुरोध किया।',
      es: 'En el Suplico, la actora solicitó 3.200 $ de devolución de fianza, 6.400 $ de penalización por mala fe y 185 $ de tasas judiciales.',
      de: 'Im Klageantrag forderte der Kläger 3.200 $ Kaution, 6.400 $ gesetzliche Strafgelder wegen Arglist und 185 $ Gerichtsgebühren.',
      fr: 'Dans le dispositif, le demandeur a réclamé 3 200 $ de restitution de caution, 6 400 $ d’amende civile pour mauvaise foi et 185 $ de frais de greffe.',
      ja: '請求の趣旨において、原告は敷金返還3,200ドル、悪意に対する法定倍額賠償6,400ドル、および申立手数料185ドルの支払いを求めた。',
      zh: '在诉讼请求中，原告请求判令被告返还押金 3,200 美元、恶意克扣法定惩罚性赔偿金 6,400 美元及起诉立案规费 185 美元。'
    }
  },
  {
    id: 'verification',
    term: {
      en: 'Verification',
      hi: 'सत्यापन (Verification under Perjury)',
      es: 'Verificación Jurada (Verification)',
      de: 'Eidesstattliche Versicherung der Klageangaben (Verification)',
      fr: 'Attestation Juratoire de Sincérité (Verification)',
      ja: '宣誓認証・真実陳述宣誓（Verification）',
      zh: '宣誓如实声明 (Verification / 伪证受罚保证书)'
    },
    phonetic: 'vair-ih-fih-KAY-shun',
    category: 'procedural',
    plainEnglish: {
      en: 'A formal sworn declaration signed under penalty of perjury certifying that the facts stated in the complaint or pleading are true and correct.',
      hi: 'झूठी गवाही के दंड के तहत हस्ताक्षरित एक औपचारिक शपथ घोषणा जो प्रमाणित करती है कि शिकायत में बताए गए तथ्य सही हैं।',
      es: 'Declaración formal prestada bajo fe de juramento que certifica que los hechos expuestos en la demanda son ciertos de su propio conocimiento.',
      de: 'Eine unter Strafandrohung bei Falschaussage abgegebene Erklärung, dass die Tatsachenangaben der Klageschrift der Wahrheit entsprechen.',
      fr: 'Déclaration formelle signée sous peine de parjure attestant de la véracité et de l’exactitude des faits énoncés.',
      ja: '偽証罪の罰則を前提として、訴状または準備書面に記載された事実が真実かつ正確であることを証明する正式な宣誓署名。',
      zh: '在伪证罪法律制裁威胁下签署的正式书面宣誓声明，郑重保证起诉状或答辩状中所载明的案件事实均完全真实准确。'
    },
    courtContext: {
      en: 'Required in certain civil actions (like unlawful detainer, injunctions, or quiet title).',
      hi: 'कुछ नागरिक कार्रवाइयों में आवश्यक (जैसे गैरकानूनी हिरासत, निषेधाज्ञा, या शांत शीर्षक)।',
      es: 'Exigida preceptivamente en procedimientos especiales como desahucios, interdictos o juicios reivindicatorios.',
      de: 'In bestimmten Eilverfahren (wie einstweiligen Verfügungen oder Räumungsklagen) gesetzlich zwingend.',
      fr: 'Requise dans certaines procédures d’urgence (comme les référés-expulsions ou les actions en revendication).',
      ja: '建物明渡請求、差止仮処分、所有権確認訴訟などの特定の民事手続きにおいて法的に義務付けられます。',
      zh: '在非法留滞驱逐诉讼、禁令救济申请或不动产确权之诉等特定民商事诉讼程序中为法定强制前置要件。'
    },
    proSeTip: {
      en: 'A verified complaint forces the defendant to file a verified answer with specific admissions and denials under penalty of perjury.',
      hi: 'एक सत्यापित शिकायत प्रतिवादी को झूठी गवाही के तहत विशिष्ट स्वीकारोक्ति और इनकार के साथ एक सत्यापित उत्तर दाखिल करने के लिए मजबूर करती है।',
      es: 'Una demanda verificada bajo juramento obliga al demandado a contestar también bajo fe de juramento sobre cada hecho.',
      de: 'Eine eidesstattlich versicherte Klage zwingt den Beklagten zu einer ebenfalls eidesstattlichen Klageerwiderung.',
      fr: 'Une assignation certifiée sous serment contraint le défendeur à répondre également sous peine de sanctions pénales.',
      ja: '認証済みの訴状を提出すると、被告もまた偽証罪の罰則下で個別の事実を認否する認証済み答弁書の提出を余儀なくされます。',
      zh: '提交经宣誓认证的起诉状，可从程序上倒逼被告亦必须在伪证受罚前提下逐项对事实作出实名宣誓认证答辩。'
    },
    exampleSentence: {
      en: 'Plaintiff attached a sworn Verification to the complaint, subjecting all allegations to the penalties of perjury.',
      hi: 'वादी ने शिकायत के साथ एक शपथ सत्यापन संलग्न किया, जिससे सभी आरोप झूठी गवाही के दंड के अधीन हो गए।',
      es: 'El demandante acompañó la demanda con una declaración jurada de verificación, asumiendo responsabilidad por falso testimonio.',
      de: 'Die Klägerin fügte der Klage eine eidesstattliche Versicherung bei, wodurch alle Angaben strafbewehrt wurden.',
      fr: 'Le demandeur a joint une attestation sur l’honneur sous peine de parjure à son assignation.',
      ja: '原告は訴状に認証書を添付し、すべての主張について偽証罪の責任を負うことを明確にした。',
      zh: '原告随起诉状一并附上了经签署的宣誓声明书，使其陈述的全部事实处于伪证罪法定责任的严格约束之下。'
    }
  },
  {
    id: 'default_judgment',
    term: {
      en: 'Default Judgment (FRCP Rule 55)',
      hi: 'डिफ़ॉल्ट निर्णय (FRCP नियम 55)',
      es: 'Sentencia en Rebeldía (FRCP Regla 55)',
      de: 'Versäumnisurteil (FRCP Rule 55)',
      fr: 'Jugement par Défaut (FRCP Règle 55)',
      ja: '欠席判決（FRCP規則第55条）',
      zh: '缺席判决 (FRCP 规则 55 / 被告弃权败诉判决)'
    },
    phonetic: 'dih-FAWLT JUHJ-munt',
    category: 'procedural',
    plainEnglish: {
      en: 'A binding judgment granted to the plaintiff when the defendant has been properly served with the summons and complaint but fails to respond within the deadline (usually 21–30 days).',
      hi: 'वादी को दिया गया एक बाध्यकारी निर्णय जब प्रतिवादी को सम्मन दिए जाने के बाद भी वह समय सीमा (21-30 दिन) में जवाब देने में विफल रहता है।',
      es: 'Sentencia vinculante concedida al actor cuando el demandado ha sido debidamente citado pero no comparece ni contesta en plazo (21–30 días).',
      de: 'Ein rechtskräftiges Urteil zu Gunsten des Klägers, wenn der ordnungsgemäß geladene Beklagte die Klageerwiderungsfrist ungenutzt verstreichen lässt.',
      fr: 'Jugement rendu en faveur du demandeur lorsque le défendeur régulièrement assigné ne comparaît pas dans le délai légal (21 à 30 jours).',
      ja: '召喚状が適法に送達されたにもかかわらず、被告が法定期間内（通常21〜30日）に答弁を行わなかった場合に原告勝訴として下される確定判決。',
      zh: '在向被告合法送达传票与诉状后，若被告未在法定期限内（通常为 21-30 天）提交书面答辩状，法院依法向原告直接作出的支持判决。'
    },
    courtContext: {
      en: 'Two-step process: (1) Entry of Default by clerk; (2) Entry of Default Judgment by judge or clerk with proof of damages.',
      hi: 'दो-चरणीय प्रक्रिया: (1) क्लर्क द्वारा डिफ़ॉल्ट दर्ज करना; (2) नुकसान के सबूत के साथ न्यायाधीश या क्लर्क द्वारा डिफ़ॉल्ट निर्णय दर्ज करना।',
      es: 'Procedimiento en dos fases: (1) Declaración formal de rebeldía por el secretario; (2) Dictado de la sentencia en rebeldía por el juez acreditando cuantía.',
      de: 'Zweistufiger Ablauf: (1) Feststellung der Säumnis durch den Urkundsbeamten; (2) Erlass des Versäumnisurteils durch den Richter.',
      fr: 'Procédure en deux étapes : (1) Constat du défaut par le greffier ; (2) Prononcé du jugement par défaut avec justification des préjudices.',
      ja: '2段階の手続き：(1) 書記官による欠席事実の記録（Entry of Default）、(2) 損害額立証に基づく裁判官による欠席判決の発令。',
      zh: '普通法两步程序：(1) 由书记官签发正式缺席记录裁定；(2) 原告举证核实损失额后，由法官正式签署下达缺席判决。'
    },
    proSeTip: {
      en: 'Keep strict proof of service and itemized receipts ready to submit with your default prove-up package.',
      hi: 'अपने डिफ़ॉल्ट साबित करने वाले पैकेज के साथ जमा करने के लिए सेवा के सख्त सबूत और मदवार रसीदें तैयार रखें।',
      es: 'Conserve de forma rigurosa la cédula de citación y facturas desglosadas para el paquete de liquidación de daños en rebeldía.',
      de: 'Halten Sie den unanfechtbaren Zustellungsnachweis sowie spezifizierte Schadensbelege für das Säumnispaket bereit.',
      fr: 'Conservez soigneusement la preuve de signification et les justificatifs détaillés pour la liquidation du préjudice par défaut.',
      ja: '欠席判決立証用書類（Prove-up Package）として、厳格な送達証明書と費用の領収書明細を完備しておいてください。',
      zh: '务必保管好无可挑剔的送达回执证明原件，并准备好详尽的损失票据，以备递交缺席事实证明核定卷宗。'
    },
    exampleSentence: {
      en: 'After Defendant failed to answer for 45 days after personal service, the clerk entered default judgment for $8,500.',
      hi: 'व्यक्तिगत सेवा के 45 दिनों बाद प्रतिवादी के जवाब देने में विफल रहने के बाद, क्लर्क ने $8,500 का डिफ़ॉल्ट निर्णय दर्ज किया।',
      es: 'Tras 45 días sin contestar tras la notificación personal, el secretario judicial registró sentencia en rebeldía por 8.500 $.',
      de: 'Nachdem der Beklagte 45 Tage lang schwieg, erging ein Versäumnisurteil über 8.500 $.',
      fr: 'Le défendeur n’ayant pas répondu 45 jours après la signification à personne, le greffe a inscrit un jugement par défaut de 8 500 $.',
      ja: '直接送達から45日間被告からの答弁がなかったため、書記官は8,500ドルの欠席判決を登録した。',
      zh: '在当面直接送达满 45 天而被告仍无任何答辩后，书记官依法为原告办理了金额为 8,500 美元的缺席胜诉判决登记。'
    }
  },
  {
    id: 'motion_to_compel',
    term: {
      en: 'Motion to Compel',
      hi: 'बाध्य करने का प्रस्ताव (Motion to Compel)',
      es: 'Moción para Compeler (Obligar a Aportar Pruebas)',
      de: 'Antrag auf Erzwingung der Beweisauskunft (Motion to Compel)',
      fr: 'Requête aux Fins d’Injonction de Communiquer (Motion to Compel)',
      ja: '証拠開示強制の申立て（Motion to Compel）',
      zh: '强制取证命令动议 (Motion to Compel)'
    },
    phonetic: 'MOH-shun too kum-PEL',
    category: 'procedural',
    plainEnglish: {
      en: 'A motion asking the judge to order the other party to answer ignored discovery questions, produce hidden documents, or show up for a deposition.',
      hi: 'न्यायाधीश से दूसरे पक्ष को अनदेखे किए गए खोज प्रश्नों का उत्तर देने, छिपे हुए दस्तावेज़ पेश करने का आदेश देने के लिए एक प्रस्ताव।',
      es: 'Una solicitud que pide al juez ordenar a la contraparte responder preguntas ignoradas, exhibir documentos o comparecer a declarar.',
      de: 'Gerichtlicher Antrag, die Gegenpartei zur Beantwortung ignorierter Beweisfragen oder Herausgabe verweigerter Akten zu zwingen.',
      fr: 'Requête sollicitant du juge qu’il ordonne à l’adversaire de répondre aux demandes d’instruction ignorées ou de produire les pièces.',
      ja: '無視された質問書への回答、秘匿された証拠書類の提出、または口頭証言録取への出頭を相手方に命じるよう裁判官に求める申立て。',
      zh: '向法官提出的一项强制动议，请求法院正式下达司法命令，强制责令消极拖延的对方如实回答质询问卷、交出隐藏书证或出席宣誓取证。'
    },
    courtContext: {
      en: 'Requires a prior "meet and confer" in good faith to resolve the dispute before running to the judge.',
      hi: 'न्यायाधीश के पास जाने से पहले विवाद को सुलझाने के लिए सद्भावना में पूर्व "बैठक और सम्मेलन" की आवश्यकता होती है।',
      es: 'Exige preceptivamente haber realizado un trámite de negociación previa de buena fe antes de acudir al tribunal.',
      de: 'Erfordert zwingend den Nachweis eines vorigen gütlichen Einigungsversuchs ("Meet and Confer") vor Anrufung des Gerichts.',
      fr: 'Nécessite impérativement une tentative préalable de concertation de bonne foi ("meet and confer") avant de saisir le juge.',
      ja: '裁判官に申し立てる前に、争点解消のための事前協議（Meet and Confer）を誠実に行った実績が必須です。',
      zh: '在向法官正式立案申请该动议之前，法律强制要求当事人必须先行履行善意协商（Meet and Confer）的前置程序。'
    },
    proSeTip: {
      en: 'Document all emails where you asked them to comply; judges frequently award monetary sanctions against stubborn parties.',
      hi: 'उन सभी ईमेल का दस्तावेजीकरण करें जहां आपने उनसे अनुपालन करने के लिए कहा था; न्यायाधीश अक्सर हठी पक्षों के खिलाफ मौद्रिक प्रतिबंध लगाते हैं।',
      es: 'Documente todos los correos de requerimiento previo; los jueces suelen imponer sanciones económicas a partes recalcitrantes.',
      de: 'Dokumentieren Sie alle Aufforderungsschreiben; Gerichte verhängen bei unkooperativen Parteien regelmäßig Kostensanktionen.',
      fr: 'Conservez tous les échanges de relance ; les tribunaux condamnent fréquemment les parties récalcitrantes à des astreintes financières.',
      ja: '提出を催告したすべての電子メールを記録してください。不当に拒否する当事者に対して裁判官は頻繁に金銭的制裁を科します。',
      zh: '务必保存好此前催告履行的所有电子邮件记录；法官经常对无故消极对抗调查的一方当事人处以巨额金钱制裁。'
    },
    exampleSentence: {
      en: 'Plaintiff filed a Motion to Compel after Defendant repeatedly refused to produce their bank account statements.',
      hi: 'प्रतिवादी द्वारा बार-बार अपने बैंक खाते के विवरण पेश करने से इनकार करने के बाद वादी ने बाध्य करने का प्रस्ताव दायर किया।',
      es: 'El demandante interpuso una Moción para Compeler tras la reiterada negativa del demandado a exhibir sus extractos bancarios.',
      de: 'Die Klägerin stellte einen Erzwingungsantrag, nachdem der Beklagte die Herausgabe von Kontoauszügen verweigert hatte.',
      fr: 'Le demandeur a formulé une requête en injonction de communiquer suite aux refus réitérés du défendeur de produire ses relevés bancaires.',
      ja: '被告が銀行口座明細の開示を再三拒否したため、原告は証拠開示強制申立てを提出した。',
      zh: '在被告多次蓄意拒绝提供其银行账户明细流水后，原告依法向法院申请了强制取证命令动议。'
    }
  },
  {
    id: 'ex_parte',
    term: {
      en: 'Ex Parte Application',
      hi: 'एकपक्षीय आवेदन (Ex Parte Application)',
      es: 'Solicitud Ex Parte (Medida Cautelar de Urgencia)',
      de: 'Ex-Parte-Eilantrag (Ohne vorherige Anhörung)',
      fr: 'Requête Unilatérale d’Urgence (Ex Parte)',
      ja: '一方的緊急申立て（Ex Parte Application）',
      zh: '单方紧急申请 (Ex Parte / 避开常规听证紧急裁定)'
    },
    phonetic: 'eks PAR-tay',
    category: 'procedural',
    plainEnglish: {
      en: 'An emergency court application heard with minimal or zero advance notice to prevent immediate, irreparable harm before a formal noticed hearing can take place.',
      hi: 'एक औपचारिक सुनवाई होने से पहले तत्काल, अपूरणीय क्षति को रोकने के लिए न्यूनतम या बिना किसी पूर्व सूचना के सुना जाने वाला एक आपातकालीन अदालती आवेदन।',
      es: 'Una solicitud judicial urgente que se resuelve de inmediato sin traslado previo para evitar un daño irreparable inminente.',
      de: 'Ein gerichtlicher Eilantrag mit minimaler oder ohne Vorankündigung zur Verhinderung eines drohenden schweren Nachteils.',
      fr: 'Une demande judiciaire d’extrême urgence examinée sans préavis pour prévenir un dommage irréversible imminent.',
      ja: '通常の事前告知期日を待つ時間がない場合に、差し迫った回復不能の損害を防ぐために行われる一方当事者からの緊急申立て。',
      zh: '在常规排期听证来不及阻止不可挽回之严重损害时，在无需或仅需极短预先通知情况下请求法官当即审理的紧急临时救济申请。'
    },
    courtContext: {
      en: 'Used for temporary restraining orders, asset freezing, or emergency preservation of evidence.',
      hi: 'अस्थायी निरोधक आदेश, संपत्ति को फ्रीज करने या साक्ष्य के आपातकालीन संरक्षण के लिए उपयोग किया जाता है।',
      es: 'Utilizado para órdenes de alejamiento provisionales, congelación cautelar de activos o aseguramiento de pruebas.',
      de: 'Eingesetzt für einstweilige Verfügungen, Kontosperren oder dringende Beweissicherungen.',
      fr: 'Utilisé pour les ordonnances de suspension provisoire, le gel d’avoirs ou la sauvegarde d’urgence de preuves.',
      ja: '仮処分命令、銀行口座や資産の仮差押え、緊急証拠保全のために申し立てられます。',
      zh: '常用于申请临时禁令、紧急司法冻结被转移资产或现场紧急保全可能灭失之核心证据。'
    },
    proSeTip: {
      en: 'You must prove true emergency and show you made reasonable efforts to notify the other side by phone or email.',
      hi: 'आपको वास्तविक आपातकाल साबित करना होगा और दिखाना होगा कि आपने फोन या ईमेल द्वारा दूसरे पक्ष को सूचित करने का प्रयास किया।',
      es: 'Debe acreditar una verdadera situación de extrema urgencia y justificar intentos razonables de preaviso a la contraria.',
      de: 'Sie müssen die Eilbedürftigkeit glaubhaft machen und nachweisen, die Gegenseite vorab zumindest telefonisch avisiert zu haben.',
      fr: 'Vous devez démontrer une urgence absolue et prouver vos démarches préalables raisonnables pour contacter l’autre partie.',
      ja: '真の緊急性（回復不能な損害の恐れ）と、相手方に対して電話等で事前連絡を試みた実績を客観的に証明する必要があります。',
      zh: '申请人必须举证证明存在紧迫且不可逆转的重大险情，并证明已尽到通过电话或邮件通知对方的合理勤勉义务。'
    },
    exampleSentence: {
      en: 'Plaintiff filed an ex parte application for a temporary restraining order to prevent the bank from auctioning the vehicle.',
      hi: 'वादी ने बैंक को वाहन की नीलामी करने से रोकने के लिए एक अस्थायी निरोधक आदेश के लिए एकपक्षीय आवेदन दायर किया।',
      es: 'El actor presentó una solicitud ex parte de orden cautelar para impedir que la entidad ejecutase la subasta del vehículo.',
      de: 'Der Kläger beantragte eine einstweilige Verfügung ex parte, um die Versteigerung des Kraftfahrzeugs durch die Bank zu stoppen.',
      fr: 'Le demandeur a formulé une requête ex parte pour obtenir une mesure suspensive empêchant la mise aux enchères de son véhicule.',
      ja: '原告は銀行による車両の競売執行を阻止するため、仮処分命令を求める緊急申立て（Ex Parte）を提出した。',
      zh: '原告向法官提出了单方紧急临时禁令申请，以阻止金融机构在实体判决前即擅自拍卖其涉案机动车。'
    }
  },
  {
    id: 'mitigation_of_damages',
    term: {
      en: 'Mitigation of Damages',
      hi: 'क्षति न्यूनीकरण का कर्तव्य (Mitigation of Damages)',
      es: 'Mitigación / Reducción de Daños (Mitigation of Damages)',
      de: 'Schadensminderungspflicht (Mitigation of Damages)',
      fr: 'Obligation de Minoration du Préjudice (Mitigation)',
      ja: '損害軽減義務（Mitigation of Damages）',
      zh: '减损义务 (Mitigation of Damages / 防止损失扩大)'
    },
    phonetic: 'mit-ih-GAY-shun',
    category: 'contracts',
    plainEnglish: {
      en: 'The legal duty of an injured party to take reasonable steps to minimize and avoid unnecessary financial losses after a breach or injury.',
      hi: 'उल्लंघन या चोट के बाद अनावश्यक वित्तीय नुकसान को कम करने और उससे बचने के लिए घायल पक्ष का कानूनी कर्तव्य।',
      es: 'El deber legal de la parte perjudicada de adoptar medidas razonables para aminorar las pérdidas económicas tras el incumplimiento.',
      de: 'Die gesetzliche Pflicht des Geschädigten, zumutbare Maßnahmen zur Verhinderung und Verringerung weiterer finanzieller Einbußen zu ergreifen.',
      fr: 'Le devoir légal incombant à la victime de prendre les mesures raisonnables pour limiter et éviter l’aggravation de son dommage.',
      ja: '契約違反や不法行為が発生した後、被害を受けた当事者が損害の拡大を防ぐために合理的な措置を講じるべき法的義務。',
      zh: '受损害方在遭遇违约或侵权损害后，依法负有采取合理适度措施以防止损失进一步扩大的法定义务。'
    },
    courtContext: {
      en: 'A plaintiff cannot sit back and let damages pile up if they could have easily prevented them.',
      hi: 'एक वादी चुपचाप बैठकर नुकसान को बढ़ने नहीं दे सकता यदि वे उन्हें आसानी से रोक सकते थे।',
      es: 'El perjudicado no puede cruzarse de brazos y dejar acumular perjuicios que pudo haber evitado con diligencia ordinaria.',
      de: 'Ein Kläger darf einen Schaden nicht sehenden Auges auflaufen lassen, wenn er ihn ohne Weiteres hätte abwenden können.',
      fr: 'Un demandeur ne peut pas rester passif et laisser les préjudices s’accumuler s’il pouvait aisément les éviter.',
      ja: '容易に回避可能であった損害について、原告が漫然と放置して損害額を膨らませることは法的に許されません。',
      zh: '原告不能在原本可以轻易控制损害的情况下消极放任损失持续积累并全部转嫁给对方。'
    },
    proSeTip: {
      en: 'If a landlord sues a tenant for breaking a lease, the landlord must make reasonable efforts to find a replacement tenant.',
      hi: 'यदि कोई मकान मालिक पट्टा तोड़ने के लिए किरायेदार पर मुकदमा करता है, तो मकान मालिक को एक प्रतिस्थापन किरायेदार खोजने के लिए उचित प्रयास करने चाहिए।',
      es: 'Si un arrendador demanda por rescisión anticipada del contrato, debe acreditar esfuerzos razonables para buscar un nuevo inquilino.',
      de: 'Klagt ein Vermieter wegen vorzeitiger Vertragskündigung, muss er nachweisen, sich aktiv um einen Nachmieter bemüht zu haben.',
      fr: 'Si un bailleur poursuit un locataire pour départ anticipé, il doit prouver ses démarches diligentes pour relouer le bien.',
      ja: '家主が中途解約した借家人を提訴する場合、家主側も新たな後任借家人を探す合理的努力を尽くしたことを立証する必要があります。',
      zh: '房东因租客提前退租而主张违约金的，房东依法必须证明自身已尽到积极寻找新租客以减少空置损失的勤勉义务。'
    },
    exampleSentence: {
      en: 'Defendant argued that Plaintiff failed to mitigate damages by waiting four months before looking for a replacement vehicle.',
      hi: 'प्रतिवादी ने तर्क दिया कि वादी ने प्रतिस्थापन वाहन की तलाश करने से पहले चार महीने इंतजार करके नुकसान को कम करने में विफल रहा।',
      es: 'El demandado alegó que el actor infringió el deber de mitigar daños al demorar cuatro meses la búsqueda de un vehículo sustituto.',
      de: 'Der Beklagte wandte ein, der Kläger habe seine Schadensminderungspflicht verletzt, indem er vier Monate untätig verstrich.',
      fr: 'Le défendeur a soutenu que le demandeur avait manqué à son obligation de modération en attendant quatre mois avant de chercher un véhicule.',
      ja: '被告は、原告が代替車両の手配を4か月間放置したことは損害軽減義務違反にあたると主張した。',
      zh: '被告抗辩称，原告在事故后消极等待了四个月才开始寻找替代运输车辆，依法构成了对减损义务的违反。'
    }
  }
];

// Write updated lexiconData.ts
const targetFile = path.join(SUECHEF_DIR, 'src/services/lexiconData.ts');

let fileContent = `import { LegalTerm, SupportedLanguage } from '../types';

export interface LocalizedTermEntry {
  id: string;
  term: Record<SupportedLanguage, string>;
  phonetic?: string;
  category: 'procedural' | 'evidence' | 'contracts' | 'torts' | 'latin';
  plainEnglish: Record<SupportedLanguage, string>;
  courtContext: Record<SupportedLanguage, string>;
  proSeTip: Record<SupportedLanguage, string>;
  exampleSentence: Record<SupportedLanguage, string>;
}

export const LOCALIZED_LEXICON_DATA: LocalizedTermEntry[] = ${JSON.stringify(LEXICON_ENTRIES, null, 2)};

export function getLocalizedLexicon(lang: SupportedLanguage = 'en'): LegalTerm[] {
  return LOCALIZED_LEXICON_DATA.map(item => ({
    term: item.term[lang] || item.term.en,
    phonetic: item.phonetic,
    category: item.category,
    plainEnglish: item.plainEnglish[lang] || item.plainEnglish.en,
    courtContext: item.courtContext[lang] || item.courtContext.en,
    proSeTip: item.proSeTip[lang] || item.proSeTip.en,
    exampleSentence: item.exampleSentence[lang] || item.exampleSentence.en,
  }));
}

export const LEGAL_LEXICON: LegalTerm[] = getLocalizedLexicon('en');
`;

fs.writeFileSync(targetFile, fileContent, 'utf8');
console.log('Successfully written complete localized lexiconData.ts with all 20 terms across all 7 locales!');
