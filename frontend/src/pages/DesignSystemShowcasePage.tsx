import React, { useState } from 'react'
import { PageHeader } from '@/components/shared/PageHeader'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { FormField } from '@/components/ui/form-field'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { StatCard } from '@/components/shared/StatCard'
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table'
import { Pagination } from '@/components/ui/pagination'
import { Dialog } from '@/components/ui/dialog'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { DropdownMenu } from '@/components/ui/dropdown-menu'
import { Tooltip } from '@/components/ui/tooltip'
import { Alert } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { ErrorState } from '@/components/ui/error-state'
import {
  TrendingUp,
  ShieldCheck,
  Target,
  Compass,
  MoreVertical,
  Edit,
  Trash2,
  Copy,
  CheckCircle2,
  HelpCircle,
  Layers,
} from 'lucide-react'

export const DesignSystemShowcasePage: React.FC = () => {
  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  // Sample radio value
  const [shiftSelection, setShiftSelection] = useState('morning')

  return (
    <div className="space-y-10 pb-16">
      <PageHeader
        title="UniRaah Design System & Component Library"
        description="Production visual foundation, typography scale, semantic tokens, and accessible shared components."
        breadcrumbs={
          <Breadcrumbs
            items={[
              { label: 'UniRaah', href: '/' },
              { label: 'Design System Shell' },
            ]}
          />
        }
        badge={
          <Badge variant="default" className="bg-brand-50 text-brand font-semibold">
            v1.0 Design Tokens
          </Badge>
        }
      />

      {/* 1. Brand Tokens & Color Palette */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b border-border pb-2">
          <Layers className="h-4 w-4 text-brand" />
          <h2 className="text-base font-bold text-navy">1. Brand Colors & Design Tokens</h2>
        </div>
        <p className="text-xs text-muted">
          Established palette adhering strictly to the brand specification: Primary Indigo, Dark Navy, Page Background, White Surface, Border, Muted Text, and Semantic States.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          <div className="rounded-xl border border-border bg-surface p-3 shadow-subtle space-y-2">
            <div className="h-12 w-full rounded-lg bg-brand flex items-center justify-center text-white font-mono text-xs font-semibold shadow-xs">
              #4F46E5
            </div>
            <div>
              <p className="text-xs font-bold text-navy">Primary Indigo</p>
              <p className="text-[11px] text-muted">Brand actions & accents</p>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-surface p-3 shadow-subtle space-y-2">
            <div className="h-12 w-full rounded-lg bg-navy flex items-center justify-center text-white font-mono text-xs font-semibold shadow-xs">
              #172033
            </div>
            <div>
              <p className="text-xs font-bold text-navy">Dark Navy</p>
              <p className="text-[11px] text-muted">Core typography & darks</p>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-surface p-3 shadow-subtle space-y-2">
            <div className="h-12 w-full rounded-lg bg-page border border-border flex items-center justify-center text-navy font-mono text-xs font-semibold">
              #F8FAFC
            </div>
            <div>
              <p className="text-xs font-bold text-navy">Page Background</p>
              <p className="text-[11px] text-muted">Application canvas</p>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-surface p-3 shadow-subtle space-y-2">
            <div className="h-12 w-full rounded-lg bg-surface border border-border flex items-center justify-center text-navy font-mono text-xs font-semibold">
              #FFFFFF
            </div>
            <div>
              <p className="text-xs font-bold text-navy">White Surface</p>
              <p className="text-[11px] text-muted">Cards, tables, dialogs</p>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-surface p-3 shadow-subtle space-y-2">
            <div className="h-12 w-full rounded-lg bg-border flex items-center justify-center text-navy font-mono text-xs font-semibold">
              #E2E8F0
            </div>
            <div>
              <p className="text-xs font-bold text-navy">Subtle Border</p>
              <p className="text-[11px] text-muted">Card outlines & dividers</p>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-surface p-3 shadow-subtle space-y-2">
            <div className="h-12 w-full rounded-lg bg-muted flex items-center justify-center text-white font-mono text-xs font-semibold">
              #64748B
            </div>
            <div>
              <p className="text-xs font-bold text-navy">Muted Text</p>
              <p className="text-[11px] text-muted">Secondary descriptions</p>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-surface p-3 shadow-subtle space-y-2">
            <div className="h-12 w-full rounded-lg bg-success flex items-center justify-center text-white font-mono text-xs font-semibold">
              #15803D
            </div>
            <div>
              <p className="text-xs font-bold text-navy">Success</p>
              <p className="text-[11px] text-muted">Safety tier & verification</p>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-surface p-3 shadow-subtle space-y-2">
            <div className="h-12 w-full rounded-lg bg-warning flex items-center justify-center text-white font-mono text-xs font-semibold">
              #B45309
            </div>
            <div>
              <p className="text-xs font-bold text-navy">Warning</p>
              <p className="text-[11px] text-muted">Target tier & caution</p>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-surface p-3 shadow-subtle space-y-2">
            <div className="h-12 w-full rounded-lg bg-error flex items-center justify-center text-white font-mono text-xs font-semibold">
              #B91C1C
            </div>
            <div>
              <p className="text-xs font-bold text-navy">Error / Destructive</p>
              <p className="text-[11px] text-muted">Reach tier & delete</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Buttons & Variants */}
      <section className="space-y-4">
        <div className="border-b border-border pb-2">
          <h2 className="text-base font-bold text-navy">2. Buttons & Interaction States</h2>
          <p className="text-xs text-muted">Supported variants: Primary, Secondary, Outline, Ghost, Destructive, Subtle, Link.</p>
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <Button variant="primary">Primary Indigo</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="subtle">Subtle</Button>
            <Button variant="link">Link Variant</Button>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 pt-2">
            <Button size="sm">Small Size (sm)</Button>
            <Button size="default">Default (md)</Button>
            <Button size="lg">Large Size (lg)</Button>
            <Button size="icon" variant="outline" aria-label="Sample icon button">
              <CheckCircle2 className="h-4 w-4 text-brand" />
            </Button>
            <Button isLoading>Loading State</Button>
            <Button disabled>Disabled Button</Button>
          </div>
        </div>
      </section>

      {/* 3. Form Controls & Inputs */}
      <section className="space-y-4">
        <div className="border-b border-border pb-2">
          <h2 className="text-base font-bold text-navy">3. Form Controls & Validation States</h2>
          <p className="text-xs text-muted">Text fields, selects, textareas, checkboxes, radio groups with accessible focus indicators.</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Inputs */}
          <div className="space-y-4">
            <Input
              label="Student Full Name"
              placeholder="e.g. Ayesha Fatima"
              helperText="Enter your official BIEK board registration name"
            />

            <Input
              label="Matric / SSC Percentage"
              type="number"
              defaultValue="82.4"
              helperText="Valid numerical percentage"
            />

            <Input
              label="Input with Error State"
              placeholder="invalid entry"
              defaultValue="105.0"
              error="Percentage cannot exceed 100.0%"
            />

            <FormField
              label="Course Track (Via FormField Wrapper)"
              helperText="Helper message managed by FormField component"
            >
              <div className="flex h-10 items-center rounded-lg border border-border bg-page px-3 text-sm text-navy">
                Artificial Intelligence & Machine Learning Track
              </div>
            </FormField>
          </div>

          {/* Select and Textarea */}
          <div className="space-y-4">
            <Select
              label="HSC Intermediate Group"
              helperText="Select your faculty stream"
              defaultValue="pre-engineering"
            >
              <option value="pre-engineering">Pre-Engineering (Math, Phys, Chem)</option>
              <option value="computer-science">Computer Science (ICS)</option>
              <option value="pre-medical">Pre-Medical (Biology, Phys, Chem)</option>
              <option value="commerce">Commerce</option>
            </Select>

            <Textarea
              label="Academic Notes / Remarks"
              placeholder="Mention additional mathematics, SAT scores, or quota exemptions..."
              rows={3}
              helperText="Optional context for recommendation calibration"
            />
          </div>

          {/* Checkboxes and Radios */}
          <div className="space-y-4 rounded-xl border border-border bg-surface p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-navy">
              Choice Selection Components
            </p>

            <div className="space-y-2.5">
              <Checkbox
                label="Self-Finance / Evening Shift"
                description="Include evening self-support programmes in cutoff predictions"
                defaultChecked
              />
              <Checkbox
                label="Public Sector Quota"
                description="Consider Karachi urban open merit seats"
                defaultChecked
              />
              <Checkbox
                label="Disabled Selection"
                description="This option cannot be modified"
                disabled
              />
            </div>

            <div className="pt-2 border-t border-border">
              <p className="text-xs font-semibold text-navy mb-2">Primary Shift Preference</p>
              <RadioGroup
                value={shiftSelection}
                onValueChange={setShiftSelection}
                className="space-y-1.5"
              >
                <RadioGroupItem
                  value="morning"
                  label="Morning Shift"
                  description="Standard merit lists"
                />
                <RadioGroupItem
                  value="evening"
                  label="Evening Shift"
                  description="Self-financed programs"
                />
              </RadioGroup>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Badges & Match Tiers */}
      <section className="space-y-4">
        <div className="border-b border-border pb-2">
          <h2 className="text-base font-bold text-navy">4. Badges (Eligibility Tiers & Status)</h2>
          <p className="text-xs text-muted">Badges utilize distinct icons and colors so color is never the sole indicator of state.</p>
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-muted mr-2">Eligibility Tiers:</span>
            <Badge variant="safety">
              <ShieldCheck className="h-3 w-3" />
              Safety Match (&gt;85% Chance)
            </Badge>
            <Badge variant="target">
              <Target className="h-3 w-3" />
              Target Match (50–84%)
            </Badge>
            <Badge variant="reach">
              <Compass className="h-3 w-3" />
              Reach Match (&lt;50% High Threshold)
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-muted mr-2">Data & University Status:</span>
            <Badge variant="verified">Verified Official</Badge>
            <Badge variant="pending">Pending Calibration</Badge>
            <Badge variant="open">Admissions Open</Badge>
            <Badge variant="closed">Admissions Closed</Badge>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-muted mr-2">Semantic Variants:</span>
            <Badge variant="default">Primary Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="error">Error</Badge>
            <Badge variant="info">Information</Badge>
          </div>
        </div>
      </section>

      {/* 5. Statistic Panels & Cards */}
      <section className="space-y-4">
        <div className="border-b border-border pb-2">
          <h2 className="text-base font-bold text-navy">5. Cards & Statistic Panels</h2>
          <p className="text-xs text-muted">KPI metrics panels and content cards with structured hierarchy.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Estimated Aggregate"
            value="84.2%"
            subtitle="Calculated on BIEK Part-1 formula"
            trend={{ value: "+2.4% vs last session", isPositive: true }}
            icon={<TrendingUp className="h-4 w-4 text-brand" />}
          />
          <StatCard
            title="Safety Matches"
            value="6"
            subtitle="High certainty admission opportunities"
            icon={<ShieldCheck className="h-4 w-4 text-success" />}
          />
          <StatCard
            title="Target Matches"
            value="14"
            subtitle="Competitive threshold +/- 2%"
            icon={<Target className="h-4 w-4 text-warning" />}
          />
          <StatCard
            title="Reach Matches"
            value="5"
            subtitle="Highest closing aggregate cutoffs"
            icon={<Compass className="h-4 w-4 text-error" />}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>NED University of Engineering & Technology</CardTitle>
              <CardDescription>Public Sector • University Road Corridor • Est. 1921</CardDescription>
            </CardHeader>
            <CardContent className="text-xs text-muted leading-relaxed">
              Admission aggregate formula evaluates 50% Pre-Admission Entry Test score + 50% HSC Part-1 percentage. PEC Washington Accord Level-II accredited.
            </CardContent>
            <CardFooter className="justify-between border-t border-border pt-4 text-xs">
              <span className="font-semibold text-navy">Annual Fee: PKR 98,000</span>
              <Button size="sm" variant="outline">View Criteria</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>FAST-NUCES Karachi Campus</CardTitle>
              <CardDescription>Semi-Government • National Highway / Malir • Est. 2000</CardDescription>
            </CardHeader>
            <CardContent className="text-xs text-muted leading-relaxed">
              Standard computing admission aggregate is evaluated as 50% NU Test + 40% HSC + 10% SSC. NCEAC W4 top-rated category for Software Engineering.
            </CardContent>
            <CardFooter className="justify-between border-t border-border pt-4 text-xs">
              <span className="font-semibold text-navy">Annual Fee: PKR 480,000</span>
              <Button size="sm" variant="outline">View Criteria</Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* 6. Tables & Pagination */}
      <section className="space-y-4">
        <div className="border-b border-border pb-2">
          <h2 className="text-base font-bold text-navy">6. Tables & Pagination</h2>
          <p className="text-xs text-muted">Consistent row heights, align middle, responsive horizontal scrolling, and accessible pagination.</p>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Programme</TableHead>
              <TableHead>Institution</TableHead>
              <TableHead>HSC Min %</TableHead>
              <TableHead>Annual Tuition</TableHead>
              <TableHead>Admission Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-semibold text-navy">BS Computer Science</TableCell>
              <TableCell className="text-xs text-muted">NED UET</TableCell>
              <TableCell className="font-bold text-brand">60.0%</TableCell>
              <TableCell className="font-medium text-navy">PKR 98,000</TableCell>
              <TableCell>
                <Badge variant="open">Admissions Open</Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button size="sm" variant="ghost" className="h-7 text-xs">Details</Button>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell className="font-semibold text-navy">BS Software Engineering</TableCell>
              <TableCell className="text-xs text-muted">FAST-NUCES</TableCell>
              <TableCell className="font-bold text-brand">50.0%</TableCell>
              <TableCell className="font-medium text-navy">PKR 480,000</TableCell>
              <TableCell>
                <Badge variant="verified">Verified List</Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button size="sm" variant="ghost" className="h-7 text-xs">Details</Button>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell className="font-semibold text-navy">MBBS (Open Merit)</TableCell>
              <TableCell className="text-xs text-muted">DUHS Karachi</TableCell>
              <TableCell className="font-bold text-brand">60.0%</TableCell>
              <TableCell className="font-medium text-navy">PKR 65,000</TableCell>
              <TableCell>
                <Badge variant="pending">MDCAT Pending</Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button size="sm" variant="ghost" className="h-7 text-xs">Details</Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <div className="pt-2 flex justify-center sm:justify-end">
          <Pagination
            currentPage={currentPage}
            totalPages={5}
            onPageChange={setCurrentPage}
          />
        </div>
      </section>

      {/* 7. Dialogs, Modals & Dropdown Menus */}
      <section className="space-y-4">
        <div className="border-b border-border pb-2">
          <h2 className="text-base font-bold text-navy">7. Dialogs, Confirmations & Dropdown Menus</h2>
          <p className="text-xs text-muted">Accessible modal overlays with keyboard trap, escape listener, and popover menus.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={() => setIsDialogOpen(true)} variant="outline">
            Open Standard Dialog
          </Button>

          <Button onClick={() => setIsConfirmOpen(true)} variant="destructive">
            Trigger Confirmation Dialog
          </Button>

          <DropdownMenu
            trigger={
              <Button variant="outline" className="gap-1.5">
                <span>Actions Menu</span>
                <MoreVertical className="h-4 w-4 text-muted" />
              </Button>
            }
            items={[
              { id: 'edit', label: 'Edit Record Details', icon: <Edit className="h-3.5 w-3.5" /> },
              { id: 'duplicate', label: 'Duplicate Entry', icon: <Copy className="h-3.5 w-3.5" /> },
              { id: 'div-1', label: '', divider: true },
              { id: 'delete', label: 'Archive Record', destructive: true, icon: <Trash2 className="h-3.5 w-3.5" /> },
            ]}
          />

          <Tooltip content="Tooltip explaining BIEK aggregate conversion" side="top">
            <Button variant="ghost" size="icon" aria-label="More information">
              <HelpCircle className="h-4 w-4 text-muted" />
            </Button>
          </Tooltip>
        </div>

        {/* Standard Dialog */}
        <Dialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          title="Standard Dialog Modal"
          description="Accessible modal dialog with focus management, backdrop dismissal, and escape key listener."
          maxWidth="md"
        >
          <div className="space-y-3 pt-2 text-xs text-muted leading-relaxed">
            <p>
              This dialog demonstrates standard content display without distracting borders or unnecessary animations.
            </p>
            <div className="flex justify-end gap-2 pt-3 border-t border-border">
              <Button size="sm" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Dismiss
              </Button>
              <Button size="sm" onClick={() => setIsDialogOpen(false)}>
                Save Changes
              </Button>
            </div>
          </div>
        </Dialog>

        {/* Confirm Dialog */}
        <ConfirmDialog
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={() => setIsConfirmOpen(false)}
          title="Delete Programme Offering?"
          description="This action will remove the selected BS Artificial Intelligence programme from the Karachi 2025/26 admission recommendations. Are you sure you wish to continue?"
          confirmText="Yes, Delete Record"
          cancelText="Cancel"
          variant="destructive"
        />
      </section>

      {/* 8. Alerts, Feedback & Loading States */}
      <section className="space-y-4">
        <div className="border-b border-border pb-2">
          <h2 className="text-base font-bold text-navy">8. Alerts, Feedback & Loading States</h2>
          <p className="text-xs text-muted">Status alerts, pulse skeletons, empty states, and error retry states.</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Alert type="info" title="Karachi Board Equivalence Update">
            Students appearing under Cambridge A-Levels or Federal Board FBISE are evaluated via IBCC formula equivalence.
          </Alert>

          <Alert type="success" title="Cutoffs Verified by Syndicate">
            2024 Round-1 opening and closing merit aggregates have been cross-checked with gazette records.
          </Alert>

          <Alert type="warning" title="Pre-Medical Math Deficiency">
            HEC policy mandates 2 deficiency math courses during Year 1 for Pre-Medical students admitted into Computing.
          </Alert>

          <Alert type="danger" title="Seat Threshold Reached">
            The open-merit morning quota for this category is currently at maximum capacity.
          </Alert>
        </div>

        {/* Skeletons and Empty/Error States */}
        <div className="grid gap-6 sm:grid-cols-3 pt-4">
          <Card className="p-4 space-y-3">
            <p className="text-xs font-bold text-navy uppercase tracking-wider">Content Skeletons</p>
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-4 w-1/2" />
          </Card>

          <EmptyState
            title="No Matched Programmes"
            description="No programmes found under the selected filters."
            actionLabel="Reset Filters"
            onAction={() => {}}
          />

          <ErrorState
            title="Failed to Load Data"
            description="Could not synchronize cutoff records with the server."
            onRetry={() => {}}
          />
        </div>
      </section>
    </div>
  )
}
