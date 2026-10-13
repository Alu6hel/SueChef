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
  }
];

// Read existing lexiconData.ts and check terms
const lexiconPath = path.join(SUECHEF_DIR, 'src/services/lexiconData.ts');
const rawOriginal = fs.readFileSync(lexiconPath, 'utf8');

// We will generate an updated lexiconData.ts that supports getLocalizedLexicon(lang)
let generatedCode = `import { LegalTerm, SupportedLanguage } from '../types';

interface LocalizedTermEntry {
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

fs.writeFileSync(lexiconPath, generatedCode, 'utf8');
console.log('Successfully updated src/services/lexiconData.ts with getLocalizedLexicon support!');
