import * as React from 'npm:react@18.3.1'
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface Props {
  firstName?: string
}

const InquiryConfirmation = ({ firstName }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Thank you for your inquiry — KnightTek</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={heading}>KnightTek</Heading>
        <Hr style={divider} />
        <Text style={paragraph}>{firstName ? `Hello ${firstName},` : 'Hello,'}</Text>
        <Text style={paragraph}>
          Thank you for your inquiry! A member of our team will be in contact
          with you shortly regarding your request. Thank you for your interest
          in KnightTek, we look forward to working with you.
        </Text>
        <Text style={paragraph}>
          Kind regards,
          <br />
          The KnightTek Inquiry Team
        </Text>
        <Hr style={divider} />
        <Text style={footer}>
          KnightTek — Safety Through Innovative Solutions
          <br />
          1-833-466-5835 · info@ktekglobal.com
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: InquiryConfirmation,
  subject: 'Thank you for your inquiry — KnightTek',
  displayName: 'Inquiry confirmation (auto-reply)',
  previewData: { firstName: 'Jane' },
} satisfies TemplateEntry

const main = {
  backgroundColor: '#ffffff',
  fontFamily: 'Arial, Helvetica, sans-serif',
}

const container = {
  padding: '32px 25px',
  maxWidth: '560px',
}

const heading = {
  color: '#0f2a4a',
  fontSize: '24px',
  margin: '0 0 8px',
}

const divider = {
  borderColor: '#e2e8f0',
  margin: '16px 0',
}

const paragraph = {
  color: '#1f2937',
  fontSize: '15px',
  lineHeight: '24px',
}

const footer = {
  color: '#6b7280',
  fontSize: '12px',
  lineHeight: '18px',
}
