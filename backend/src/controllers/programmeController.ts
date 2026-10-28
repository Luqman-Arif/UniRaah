import { Request, Response } from 'express'
import universitiesData from '../db/seeds/universities.json' with { type: 'json' }
import programmesData from '../db/seeds/programmes.json' with { type: 'json' }
import { AdmissionEngine } from '../services/admissionEngine.js'
import { Programme, University } from '../types/index.js'

const universities: University[] = universitiesData as University[]
const programmes: Programme[] = programmesData as Programme[]

export class ProgrammeController {
  public static getAllUniversities(req: Request, res: Response): void {
    const { sector, locationZone } = req.query

    let filtered = universities
    if (sector && typeof sector === 'string') {
      filtered = filtered.filter((u) => u.sector.toLowerCase() === sector.toLowerCase())
    }
    if (locationZone && typeof locationZone === 'string') {
      filtered = filtered.filter((u) =>
        u.locationZone.toLowerCase().includes(locationZone.toLowerCase())
      )
    }

    res.status(200).json({
      success: true,
      count: filtered.length,
      data: filtered,
    })
  }

  public static getUniversityById(req: Request, res: Response): void {
    const { id } = req.params
    const university = universities.find((u) => u.id === id)

    if (!university) {
      res.status(404).json({
        success: false,
        error: `University with ID '${id}' not found.`,
      })
      return
    }

    const universityProgrammes = programmes.filter((p) => p.universityId === id)

    res.status(200).json({
      success: true,
      data: {
        ...university,
        programmes: universityProgrammes,
      },
    })
  }

  public static getAllProgrammes(req: Request, res: Response): void {
    const { discipline, hscGroup, maxFee } = req.query

    let filtered = programmes
    if (discipline && typeof discipline === 'string') {
      filtered = filtered.filter((p) =>
        p.discipline.toLowerCase().includes(discipline.toLowerCase())
      )
    }
    if (hscGroup && typeof hscGroup === 'string') {
      filtered = filtered.filter((p) =>
        p.eligibleHscGroups.some((g) => g.toLowerCase() === hscGroup.toLowerCase())
      )
    }
    if (maxFee && !isNaN(Number(maxFee))) {
      filtered = filtered.filter((p) => p.annualTuitionFeePkr <= Number(maxFee))
    }

    res.status(200).json({
      success: true,
      count: filtered.length,
      data: filtered,
    })
  }

  public static getProgrammeById(req: Request, res: Response): void {
    const { id } = req.params
    const programme = programmes.find((p) => p.id === id)

    if (!programme) {
      res.status(404).json({
        success: false,
        error: `Programme with ID '${id}' not found.`,
      })
      return
    }

    const university = universities.find((u) => u.id === programme.universityId)

    res.status(200).json({
      success: true,
      data: {
        ...programme,
        university,
      },
    })
  }

  public static predictAdmission(req: Request, res: Response): void {
    const { hscPercentage, entryTestScore, programmeId } = req.body

    if (hscPercentage === undefined || entryTestScore === undefined) {
      res.status(400).json({
        success: false,
        error: 'hscPercentage and entryTestScore are required.',
      })
      return
    }

    const programme = programmes.find((p) => p.id === programmeId)
    if (!programme) {
      res.status(404).json({
        success: false,
        error: `Programme with ID '${programmeId}' not found.`,
      })
      return
    }

    const aggregate = AdmissionEngine.calculateAggregate(
      Number(hscPercentage),
      Number(entryTestScore),
      programme.hscPercentageWeight,
      programme.entryTestPercentage,
      0,
      programme.sscPercentageWeight || 0
    )

    // Benchmark cutoff simulation
    const benchmarkCutoff = 81.5
    const category = AdmissionEngine.evaluateProbability(aggregate, benchmarkCutoff)

    res.status(200).json({
      success: true,
      data: {
        programmeId,
        programmeName: programme.name,
        calculatedAggregate: aggregate,
        benchmarkCutoff,
        probabilityCategory: category,
        delta: Math.round((aggregate - benchmarkCutoff) * 100) / 100,
      },
    })
  }
}
