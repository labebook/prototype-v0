import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import React from 'react'
import { Sidebar } from './sidebar'
import { TeamProvider } from '@/contexts/TeamContext'

const meta: Meta<typeof Sidebar> = {
  title: 'Layout/Sidebar',
  component: Sidebar,
  decorators: [
    (Story) => (
      <TeamProvider>
        <div style={{ height: '100vh' }}>
          <Story />
        </div>
      </TeamProvider>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      navigation: { pathname: '/pipelines' },
    },
  },
}

export default meta
type Story = StoryObj<typeof Sidebar>

export const ActiveProjects: Story = {
    name: 'Active: Projects',
    parameters: {
        nextjs: { navigation: { pathname: '/projects' } },
    },
}

export const ActivePipelines: Story = {
  name: 'Active: Pipelines',
  parameters: {
    nextjs: { navigation: { pathname: '/pipelines' } },
  },
}

export const ActiveMethods: Story = {
  name: 'Active: Methods',
  parameters: {
    nextjs: { navigation: { pathname: '/methods' } },
  },
}

export const ActiveCustomModules: Story = {
  name: 'Active: Custom Modules',
  parameters: {
    nextjs: { navigation: { pathname: '/custom-modules' } },
  },
}
