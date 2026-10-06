<template>
  <div class="legal">
    <div ref="wrapperEl" class="legal__wrapper">

      <header class="legal__header">
        <NuxtLink to="/" class="legal__back">
          {{ lang === 'fr' ? '← Retour' : '← Back' }}
        </NuxtLink>
        <div class="legal__lang">
          <button
            class="legal__lang__btn"
            :class="{ active: lang === 'en' }"
            @click="lang = 'en'"
          >EN</button>
          <span class="legal__lang__sep">|</span>
          <button
            class="legal__lang__btn"
            :class="{ active: lang === 'fr' }"
            @click="lang = 'fr'"
          >FR</button>
        </div>
      </header>

      <h1 class="legal__title">
        {{ lang === 'fr' ? 'Mentions légales' : 'Legal Notice' }}
      </h1>
      <p class="legal__updated">
        {{ lang === 'fr' ? 'Dernière mise à jour' : 'Last updated' }} : {{ lastUpdated }}
      </p>

      <!-- FRANÇAIS -->
      <template v-if="lang === 'fr'">

        <section class="legal__section">
          <p class="legal__intro">
            Bienvenue sur le portfolio de Gabin Caron. En utilisant ce site, vous reconnaissez
            avoir pris connaissance des présentes mentions légales et vous vous engagez à les respecter.
            Ces mentions ont notamment pour but de vous informer de l'existence de droits de propriété
            intellectuelle ainsi que des modalités de traitement des informations vous concernant.
          </p>
        </section>

        <section class="legal__section">
          <h2 class="legal__section__title">1. Informations générales</h2>
          <p>
            <strong>Gabin Caron</strong><br>
            Développeur web<br>
            France<br>
            Email : <a href="mailto:gabindevelops@gmail.com">gabindevelops@gmail.com</a>
          </p>
          <p>Directeur de la publication : <strong>Gabin Caron</strong></p>
        </section>

        <section class="legal__section">
          <h2 class="legal__section__title">2. Hébergement</h2>
          <p>
            Le site est hébergé par <strong>Vercel, Inc.</strong><br>
            340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis<br>
            Contact : <a href="mailto:support@vercel.com">support@vercel.com</a> —
            <a href="https://vercel.com/legal" target="_blank" rel="noopener noreferrer">vercel.com/legal</a>
          </p>
          <p>
            Nom de domaine : gabincaron.com<br>
            Adresse du site : <a href="https://www.gabincaron.com">https://www.gabincaron.com</a>
          </p>
        </section>

        <section class="legal__section">
          <h2 class="legal__section__title">3. Propriété intellectuelle</h2>
          <p>
            L'ensemble du contenu de ce site — incluant, sans s'y limiter, les textes,
            la mise en page, le design, le code source, les animations et les visuels créés par
            Gabin Caron — est protégé par le droit d'auteur et constitue la propriété exclusive
            de Gabin Caron.
          </p>
          <p>
            Toute reproduction, représentation, modification, publication ou transmission, totale ou
            partielle, du site ou de son contenu, par quelque procédé que ce soit et sur quelque
            support que ce soit, est interdite sans l'autorisation écrite préalable de Gabin Caron.
          </p>
        </section>

        <section class="legal__section">
          <h2 class="legal__section__title">4. Crédits photographiques</h2>
          <p>Certaines photographies utilisées sur ce site sont issues des plateformes suivantes :</p>
          <ul>
            <li>
              <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer">Unsplash</a> —
              images sous licence Unsplash (utilisation gratuite autorisée)
            </li>
            <li>
              Prismic Media Library — images personnelles hébergées via
              <a href="https://prismic.io" target="_blank" rel="noopener noreferrer">Prismic</a>
            </li>
          </ul>
          <p>
            Si vous estimez qu'une image publiée sur ce site porte atteinte à vos droits,
            contactez-nous à <a href="mailto:gabindevelops@gmail.com">gabindevelops@gmail.com</a>.
          </p>
        </section>

        <section class="legal__section">
          <h2 class="legal__section__title">5. Cookies</h2>
          <p>
            Ce site n'utilise aucun cookie de traçage, de mesure d'audience ou publicitaire,
            et n'affiche donc pas de bandeau de consentement. Les seules données de navigation
            traitées sont les journaux techniques de l'hébergeur, décrits à la section 6.
          </p>
          <p>
            Des cookies techniques strictement nécessaires au bon fonctionnement du site
            peuvent être déposés par votre navigateur. Ils ne contiennent aucune donnée
            personnelle identifiable et sont supprimés automatiquement en fin de session.
          </p>
        </section>

        <section class="legal__section">
          <h2 class="legal__section__title">6. Informatique et libertés — RGPD</h2>
          <p>
            Gabin Caron respecte et protège la vie privée de ses utilisateurs. Aucune information
            personnelle n'est collectée à votre insu, ni revendue à des tiers.
          </p>
          <p>
            Ce site se conforme au Règlement Général sur la Protection des Données n°2016/679 (RGPD)
            et à la Loi n°78-17 du 6 janvier 1978 relative à l'informatique, aux fichiers et aux libertés.
          </p>
          <p>Responsable du traitement : <strong>Gabin Caron</strong> — <a href="mailto:gabindevelops@gmail.com">gabindevelops@gmail.com</a></p>
          <p><strong>Données traitées</strong></p>
          <ul>
            <li>
              <strong>Journaux techniques</strong> (adresse IP, date et heure, page demandée, navigateur) :
              enregistrés automatiquement par l'hébergeur Vercel pour assurer le fonctionnement et la
              sécurité du site. Base légale : intérêt légitime. Durée : selon la politique de
              conservation de Vercel, limitée à ce qui est nécessaire à ces finalités.
            </li>
            <li>
              <strong>Emails</strong> (nom, adresse email, contenu du message) : utilisés uniquement
              pour répondre à votre demande. Base légale : intérêt légitime à répondre aux messages reçus.
              Durée : 3 ans après le dernier échange, puis suppression.
            </li>
            <li>
              <strong>Chargement des images</strong> : les images du site sont servies par le CDN de
              Prismic, qui reçoit à cette occasion l'adresse IP de votre navigateur.
            </li>
          </ul>
          <p>
            Aucune donnée n'est vendue, ni utilisée à des fins publicitaires ou de profilage.
            Les polices de caractères sont hébergées avec le site : aucune donnée n'est transmise
            à Google Fonts.
          </p>
          <p>
            <strong>Transfert hors de l'Union européenne</strong> : Vercel étant établi aux États-Unis,
            les journaux techniques peuvent y être traités. Ce transfert est encadré par le
            Data Privacy Framework UE–États-Unis et par les clauses contractuelles types de la
            Commission européenne (voir la
            <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">politique de confidentialité de Vercel</a>).
          </p>
          <p>Conformément à la réglementation en vigueur, vous disposez des droits suivants :</p>
          <ul>
            <li>Droit d'accès et de rectification</li>
            <li>Droit à l'effacement (« droit à l'oubli »)</li>
            <li>Droit à la limitation du traitement</li>
            <li>Droit à la portabilité des données</li>
            <li>Droit d'opposition</li>
          </ul>
          <p>
            Pour exercer ces droits :
            <a href="mailto:gabindevelops@gmail.com">gabindevelops@gmail.com</a>
          </p>
          <p>
            Vous pouvez également adresser une réclamation à la
            <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">CNIL</a>.
          </p>
        </section>

        <section class="legal__section">
          <h2 class="legal__section__title">7. Contenu embarqué</h2>
          <p>
            Ce site n'intègre aucun contenu tiers (vidéo, réseau social, carte, etc.).
            Seules les images sont chargées depuis le CDN de
            <a href="https://prismic.io/legal/privacy" target="_blank" rel="noopener noreferrer">Prismic</a>,
            le service qui gère le contenu du site.
          </p>
        </section>

        <section class="legal__section">
          <h2 class="legal__section__title">8. Liens hypertextes</h2>
          <p>
            Ce site peut contenir des liens vers des sites tiers. Gabin Caron décline toute
            responsabilité quant à leur contenu ou disponibilité.
          </p>
          <p>
            La création de liens vers ce site est autorisée sous réserve qu'ils ne portent
            pas atteinte à l'image de l'éditeur.
          </p>
        </section>

        <section class="legal__section">
          <h2 class="legal__section__title">9. Décharge de responsabilité</h2>
          <p>
            Les informations fournies sur ce site le sont à titre indicatif. Gabin Caron ne saurait
            être tenu responsable de dommages résultant de l'utilisation de ce site, d'erreurs dans
            son contenu ou de son indisponibilité temporaire.
          </p>
        </section>

        <section class="legal__section">
          <h2 class="legal__section__title">10. Droit applicable et juridiction</h2>
          <p>
            Les présentes mentions légales sont régies par le droit français. En cas de litige,
            les tribunaux français seront seuls compétents.
          </p>
        </section>

      </template>

      <!-- ENGLISH -->
      <template v-else>

        <section class="legal__section">
          <p class="legal__intro">
            Welcome to Gabin Caron's portfolio. By using this website, you acknowledge that you
            have read and agree to comply with these legal notices. These notices are intended to
            inform you of intellectual property rights and the conditions under which your
            information may be processed.
          </p>
        </section>

        <section class="legal__section">
          <h2 class="legal__section__title">1. Publisher</h2>
          <p>
            <strong>Gabin Caron</strong><br>
            Web Developer<br>
            France<br>
            Email: <a href="mailto:gabindevelops@gmail.com">gabindevelops@gmail.com</a>
          </p>
          <p>Publication director: <strong>Gabin Caron</strong></p>
        </section>

        <section class="legal__section">
          <h2 class="legal__section__title">2. Hosting</h2>
          <p>
            This website is hosted by <strong>Vercel, Inc.</strong><br>
            340 S Lemon Ave #4133, Walnut, CA 91789, USA<br>
            Contact: <a href="mailto:support@vercel.com">support@vercel.com</a> —
            <a href="https://vercel.com/legal" target="_blank" rel="noopener noreferrer">vercel.com/legal</a>
          </p>
          <p>
            Domain name: gabincaron.com<br>
            Website address: <a href="https://www.gabincaron.com">https://www.gabincaron.com</a>
          </p>
        </section>

        <section class="legal__section">
          <h2 class="legal__section__title">3. Intellectual Property</h2>
          <p>
            All content on this website — including but not limited to texts, layout, design,
            source code, animations and visuals created by Gabin Caron — is protected by copyright
            and is the exclusive property of Gabin Caron.
          </p>
          <p>
            Any reproduction, representation, modification, publication or transmission, in whole
            or in part, of the website or its content, by any means and on any medium, is prohibited
            without prior written authorization from Gabin Caron.
          </p>
        </section>

        <section class="legal__section">
          <h2 class="legal__section__title">4. Photo Credits</h2>
          <p>Some photographs used on this website come from the following platforms:</p>
          <ul>
            <li>
              <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer">Unsplash</a> —
              images under the Unsplash License (free use permitted)
            </li>
            <li>
              Prismic Media Library — personal images hosted via
              <a href="https://prismic.io" target="_blank" rel="noopener noreferrer">Prismic</a>
            </li>
          </ul>
          <p>
            If you believe an image published on this site infringes your rights,
            please contact us at <a href="mailto:gabindevelops@gmail.com">gabindevelops@gmail.com</a>.
          </p>
        </section>

        <section class="legal__section">
          <h2 class="legal__section__title">5. Cookies</h2>
          <p>
            This website does not use any tracking, analytics or advertising cookies,
            so no consent banner is displayed. The only browsing data processed are the
            hosting provider's technical logs, described in section 6.
          </p>
          <p>
            Strictly necessary technical cookies may be set by your browser for the proper
            functioning of the website. They contain no personally identifiable data and are
            automatically deleted at the end of your session.
          </p>
        </section>

        <section class="legal__section">
          <h2 class="legal__section__title">6. Privacy — GDPR</h2>
          <p>
            Gabin Caron respects and protects the privacy of its users. No personal information
            is collected without your knowledge or sold to third parties.
          </p>
          <p>
            This website complies with the General Data Protection Regulation (GDPR — EU 2016/679)
            and the French Data Protection Act of January 6, 1978.
          </p>
          <p>Data controller: <strong>Gabin Caron</strong> — <a href="mailto:gabindevelops@gmail.com">gabindevelops@gmail.com</a></p>
          <p><strong>Data processed</strong></p>
          <ul>
            <li>
              <strong>Technical logs</strong> (IP address, date and time, requested page, browser):
              automatically recorded by the hosting provider Vercel to keep the website running
              and secure. Legal basis: legitimate interest. Retention: according to Vercel's
              retention policy, limited to what these purposes require.
            </li>
            <li>
              <strong>Emails</strong> (name, email address, message content): used solely to
              respond to your request. Legal basis: legitimate interest in replying to messages
              received. Retention: 3 years after the last exchange, then deleted.
            </li>
            <li>
              <strong>Image loading</strong>: images are served by Prismic's CDN, which receives
              your browser's IP address when loading them.
            </li>
          </ul>
          <p>
            No data is sold, or used for advertising or profiling purposes. Fonts are hosted
            with the website: no data is sent to Google Fonts.
          </p>
          <p>
            <strong>Transfers outside the European Union</strong>: as Vercel is based in the
            United States, technical logs may be processed there. This transfer is covered by
            the EU–US Data Privacy Framework and the European Commission's Standard Contractual
            Clauses (see
            <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">Vercel's privacy policy</a>).
          </p>
          <p>In accordance with applicable regulations, you have the following rights:</p>
          <ul>
            <li>Right of access and rectification</li>
            <li>Right to erasure ("right to be forgotten")</li>
            <li>Right to restriction of processing</li>
            <li>Right to data portability</li>
            <li>Right to object</li>
          </ul>
          <p>
            To exercise these rights, contact:
            <a href="mailto:gabindevelops@gmail.com">gabindevelops@gmail.com</a>
          </p>
          <p>
            You also have the right to lodge a complaint with the
            <a href="https://www.cnil.fr/en" target="_blank" rel="noopener noreferrer">CNIL</a>
            (French Data Protection Authority).
          </p>
        </section>

        <section class="legal__section">
          <h2 class="legal__section__title">7. Embedded Content</h2>
          <p>
            This website does not embed any third-party content (video, social media, maps, etc.).
            Only images are loaded from the CDN of
            <a href="https://prismic.io/legal/privacy" target="_blank" rel="noopener noreferrer">Prismic</a>,
            the service that manages the website's content.
          </p>
        </section>

        <section class="legal__section">
          <h2 class="legal__section__title">8. Hyperlinks</h2>
          <p>
            This website may contain links to third-party websites. Gabin Caron disclaims
            all responsibility for their content or availability.
          </p>
          <p>
            Creating links to this website is permitted provided they do not
            misrepresent the publisher or its content.
          </p>
        </section>

        <section class="legal__section">
          <h2 class="legal__section__title">9. Disclaimer</h2>
          <p>
            The information provided on this website is for informational purposes only.
            Gabin Caron shall not be held liable for any damages resulting from the use of
            this website, errors in its content, or temporary unavailability.
          </p>
        </section>

        <section class="legal__section">
          <h2 class="legal__section__title">10. Applicable Law and Jurisdiction</h2>
          <p>
            These legal notices are governed by French law. In the event of a dispute,
            French courts shall have sole jurisdiction.
          </p>
        </section>

      </template>

      <footer class="legal__footer">
        <p>© {{ year }} Gabin Caron — All rights reserved</p>
      </footer>

    </div>
  </div>
</template>

<script setup>
import { usePageScroll } from '~/composables/usePageScroll'

useSEO({
  title: 'Legal Notice - Gabin Caron | Web Developer',
  description: 'Legal notice and privacy policy for gabincaron.com',
  path: '/legal'
})

const year = new Date().getFullYear()
const lang = ref('en') // anglais par défaut

// Date de dernière modification réelle des mentions : à mettre à jour à la main
const LAST_UPDATED = new Date('2026-10-06')

const lastUpdated = computed(() => {
  return LAST_UPDATED.toLocaleDateString(lang.value === 'fr' ? 'fr-FR' : 'en-GB', {
    day: 'numeric', month: 'long', year: 'numeric'
  })
})

// Met à jour le title selon la langue
useHead({
  title: computed(() => lang.value === 'fr'
    ? 'Mentions légales - Gabin Caron | Web Developer'
    : 'Legal Notice - Gabin Caron | Web Developer'),
  // La langue de la page suit le bouton EN | FR
  htmlAttrs: { lang: computed(() => lang.value) }
})

const wrapperEl = ref(null)
const emit = defineEmits(['page-ready'])
usePageScroll(wrapperEl, emit)
</script>