import React from 'react'

import styles from '@/app/privacy-policy/PrivacyPolicy.module.scss'
import fs from 'fs'
import Link from 'next/link'
import path from 'path'
import { remark } from 'remark'
import html from 'remark-html'

import { AnimatedButton } from '@/components/ui/AnimatedButton/AnimatedButton'


async function getPrivacyPolicyContent() {
  const filePath = path.join(
    process.cwd(),
    'src/assets/images/privacy-policy.md'
  )
  const fileContents = fs.readFileSync(filePath, 'utf8')

  const content = fileContents.replace(/^---[\s\S]*?---/, '')

  const processedContent = await remark().use(html).process(content)

  return processedContent.toString()
}

export default async function PrivacyPolicyPage() {
  const contentHtml = await getPrivacyPolicyContent()

  return (
    <main className={styles.legalContent}>
      <div
        className={styles.markdown}
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />

      <div className={styles.ctaWrapper}>
        <Link href="/" passHref>
          <AnimatedButton>Вернуться на сайт</AnimatedButton>
        </Link>
      </div>
    </main>
  )
}
