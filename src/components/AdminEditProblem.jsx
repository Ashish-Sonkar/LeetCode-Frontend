

import { useEffect, useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import axiosClient from '../utils/axiosClient'
import { useNavigate, useParams } from 'react-router'
import {
    Code2,
    FileText,
    FlaskConical,
    Plus,
    Trash2,
    CheckCircle2,
    Braces,
    Layers3
} from 'lucide-react'

// Validation schema
const problemSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    difficulty: z.enum(['easy', 'medium', 'hard']),
    tags: z.enum(['Array', 'LinkedList', 'Graph', 'Dynamic Programming', 'Basic Programming', 'Math', 'String']),

    visibleTestCases: z.array(
        z.object({
            input: z.string().min(1, 'Input is required'),
            output: z.string().min(1, 'Output is required'),
            explanation: z.string().min(1, 'Explanation is required')
        })
    ).min(1, 'At least one visible test case required'),

    hiddenTestCases: z.array(
        z.object({
            input: z.string().min(1, 'Input is required'),
            output: z.string().min(1, 'Output is required')
        })
    ).min(1, 'At least one hidden test case required'),

    startCode: z.array(
        z.object({
            language: z.enum(['C++', 'Java', 'JavaScript']),
            initialCode: z.string().min(1, 'Initial code is required')
        })
    ).length(3, 'All three languages required'),

    referenceSolution: z.array(
        z.object({
            language: z.enum(['C++', 'Java', 'JavaScript']),
            completeCode: z.string().min(1, 'Complete code is required')
        })
    ).length(3, 'All three languages required')
})

const languages = [
    { name: 'C++', color: 'text-blue-500', badge: 'bg-blue-500/10' },
    { name: 'Java', color: 'text-orange-500', badge: 'bg-orange-500/10' },
    { name: 'JavaScript', color: 'text-yellow-500', badge: 'bg-yellow-500/10' }
]

const inputClass =
    'input input-bordered w-full bg-base-100 rounded-xl focus:outline-none focus:border-primary transition-colors'

const textAreaClass =
    'textarea textarea-bordered w-full bg-base-100 rounded-xl focus:outline-none focus:border-primary transition-colors'

const sectionClass =
    'card bg-base-100 border border-base-300 shadow-sm rounded-2xl overflow-hidden'

const labelClass =
    'label-text font-semibold text-sm text-base-content/80'

function SectionHeading({ icon: Icon, title, description, number }) {
    return (
        <div className="flex items-start gap-3 mb-6">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon size={22} />
            </div>

            <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg sm:text-xl font-bold tracking-tight">
                        {title}
                    </h2>

                    <span className="text-xs rounded-full bg-base-200 px-2 py-1 text-base-content/60">
                        {number}
                    </span>
                </div>

                <p className="text-sm text-base-content/60 mt-1">
                    {description}
                </p>
            </div>
        </div>
    )
}

function FieldError({ message }) {
    if (!message) return null

    return (
        <p className="mt-1.5 text-xs text-error">
            {message}
        </p>
    )
}

function AdminEditProblem() {
    const navigate = useNavigate()
    const { id } = useParams()

    const [fetching, setFetching] = useState(true)
    const [fetchError, setFetchError] = useState('')

    const defaultValues = {
        title: '',
        description: '',
        difficulty: 'easy',
        tags: 'Array',

        visibleTestCases: [
            { input: '', output: '', explanation: '' }
        ],

        hiddenTestCases: [
            { input: '', output: '' }
        ],

        startCode: [
            { language: 'C++', initialCode: '' },
            { language: 'Java', initialCode: '' },
            { language: 'JavaScript', initialCode: '' }
        ],

        referenceSolution: [
            { language: 'C++', completeCode: '' },
            { language: 'Java', completeCode: '' },
            { language: 'JavaScript', completeCode: '' }
        ]
    }

    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: zodResolver(problemSchema),
        defaultValues
    })

    const {
        fields: visibleFields,
        append: appendVisible,
        remove: removeVisible
    } = useFieldArray({
        control,
        name: 'visibleTestCases'
    })

    const {
        fields: hiddenFields,
        append: appendHidden,
        remove: removeHidden
    } = useFieldArray({
        control,
        name: 'hiddenTestCases'
    })

    // Fetch existing problem using the actual backend GET route
    useEffect(() => {
        let isMounted = true

        const fetchProblem = async () => {
            try {
                setFetching(true)
                setFetchError('')

                if (!id) {
                    throw new Error('Problem ID is missing from the URL.')
                }

                const response = await axiosClient.get(
                    `/problem/getProblemById/${id}`
                )



                // Supports either { problem: {...} } or direct problem data
                const data = response.data
                const problem = data?.problem ?? data

                if (!problem || !problem._id) {
                    throw new Error(
                        'Problem data was not returned correctly by the backend.'
                    )
                }

                const allowedDifficulty = ['easy', 'medium', 'hard']
                const allowedTags = ['Array', 'LinkedList', 'Graph', 'Dynamic Programming', 'Basic Programming', 'Math', 'String']

                const existingStartCode = Array.isArray(problem.startCode)
                    ? problem.startCode
                    : []

                const existingSolutions = Array.isArray(problem.referenceSolution)
                    ? problem.referenceSolution
                    : []

                const formValues = {
                    title: problem.title ?? '',
                    description: problem.description ?? '',

                    difficulty: allowedDifficulty.includes(
                        String(problem.difficulty ?? '').toLowerCase()
                    )
                        ? String(problem.difficulty).toLowerCase()
                        : 'easy',

                    tags: allowedTags.includes(problem.tags)
                        ? problem.tags
                        : 'Array',

                    visibleTestCases:
                        Array.isArray(problem.visibleTestCases) &&
                            problem.visibleTestCases.length > 0
                            ? problem.visibleTestCases.map(test => ({
                                input: test.input ?? '',
                                output: test.output ?? '',
                                explanation: test.explanation ?? ''
                            }))
                            : defaultValues.visibleTestCases,

                    hiddenTestCases:
                        Array.isArray(problem.hiddenTestCases) &&
                            problem.hiddenTestCases.length > 0
                            ? problem.hiddenTestCases.map(test => ({
                                input: test.input ?? '',
                                output: test.output ?? ''
                            }))
                            : defaultValues.hiddenTestCases,

                    startCode: defaultValues.startCode.map(item => ({
                        language: item.language,
                        initialCode:
                            existingStartCode.find(
                                code => code.language === item.language
                            )?.initialCode ?? ''
                    })),

                    referenceSolution: defaultValues.referenceSolution.map(item => ({
                        language: item.language,
                        completeCode:
                            existingSolutions.find(
                                solution => solution.language === item.language
                            )?.completeCode ?? ''
                    }))
                }

                if (isMounted) {
                    reset(formValues)
                }
            } catch (error) {
                console.error('Failed to fetch problem:', error)

                if (isMounted) {
                    setFetchError(
                        error.response?.data?.message ||
                        error.message ||
                        'Failed to load problem.'
                    )
                }
            } finally {
                if (isMounted) {
                    setFetching(false)
                }
            }
        }

        fetchProblem()

        return () => {
            isMounted = false
        }
    }, [id, reset])

    // Update the existing problem using the actual backend PUT route
    const onSubmit = async (formData) => {
        try {
            if (!id) {
                alert('Problem ID nahi mili.')
                return
            }

            await axiosClient.put(
                `/problem/update/${id}`,
                formData
            )

            alert('Problem updated successfully!')
            navigate('/admin/update')
        } catch (error) {
            console.error(
                'Update problem error:',
                error.response?.data || error.message
            )

            alert(
                error.response?.data?.message ||
                error.message ||
                'Problem update nahi ho paya.'
            )
        }
    }

    if (fetching) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <span className="loading loading-spinner loading-lg text-primary" />
                <span className="ml-3">Loading problem...</span>
            </div>
        )
    }

    if (fetchError) {
        return (
            <div className="mx-auto mt-10 max-w-2xl rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
                <h2 className="font-bold">Unable to load problem</h2>
                <p className="mt-2 text-sm">{fetchError}</p>

                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="btn btn-outline mt-4"
                >
                    Go Back
                </button>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-base-200/50">
            <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">

                {/* Page Header */}
                <div className="mb-8">
                    <div className="mb-3 flex items-center gap-2 text-sm text-base-content/60">
                        <Code2 size={16} />
                        <span>Admin Dashboard</span>
                        <span>/</span>
                        <span className="text-primary">Edit Problem</span>
                    </div>

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                                Edit Problem
                            </h1>

                            <p className="mt-2 text-sm text-base-content/60 sm:text-base">
                                Update problem details, test cases and solutions.
                            </p>
                        </div>

                        <div className="flex items-center gap-2 self-start rounded-xl border border-base-300 bg-base-100 px-4 py-3">
                            <Layers3 size={19} className="text-primary" />
                            <span className="text-sm font-medium">
                                Problem Editor
                            </span>
                        </div>
                    </div>
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    {/* 01 - Basic Information */}
                    <section className={`${sectionClass} p-5 sm:p-7`}>
                        <SectionHeading
                            icon={FileText}
                            title="Basic Information"
                            description="Edit the problem title, description, difficulty and category."
                            number="01"
                        />

                        <div className="space-y-5">
                            <div>
                                <label className="label">
                                    <span className={labelClass}>
                                        Problem Title <span className="text-error">*</span>
                                    </span>
                                </label>

                                <input
                                    {...register('title')}
                                    placeholder="e.g. Two Sum"
                                    className={`${inputClass} ${errors.title ? 'input-error' : ''}`}
                                />

                                <FieldError message={errors.title?.message} />
                            </div>

                            <div>
                                <label className="label">
                                    <span className={labelClass}>
                                        Problem Description <span className="text-error">*</span>
                                    </span>
                                </label>

                                <textarea
                                    {...register('description')}
                                    rows={6}
                                    placeholder="Describe the problem, requirements and expected behavior..."
                                    className={`${textAreaClass} min-h-36 resize-y ${errors.description ? 'textarea-error' : ''}`}
                                />

                                <FieldError message={errors.description?.message} />
                            </div>

                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                <div>
                                    <label className="label">
                                        <span className={labelClass}>Difficulty Level</span>
                                    </label>

                                    <select
                                        {...register('difficulty')}
                                        className={inputClass}
                                    >
                                        <option value="easy">Easy</option>
                                        <option value="medium">Medium</option>
                                        <option value="hard">Hard</option>
                                    </select>

                                    <FieldError message={errors.difficulty?.message} />
                                </div>

                                <div>
                                    <label className="label">
                                        <span className={labelClass}>Problem Category</span>
                                    </label>

                                    <select
                                        {...register('tags')}
                                        className={inputClass}
                                    >
                                        <option value="Array">Array</option>
                                        <option value="LinkedList">Linked List</option>
                                        <option value="Graph">Graph</option>
                                        <option value="Dynamic Programming">Dynamic Programming</option>
                                        <option value="Basic Programming">Basic Programming</option>
                                        <option value="Math">Math</option>
                                        <option value="String">String</option>
                                    </select>

                                    <FieldError message={errors.tags?.message} />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 02 - Test Cases */}
                    <section className={`${sectionClass} p-5 sm:p-7`}>
                        <SectionHeading
                            icon={FlaskConical}
                            title="Test Cases"
                            description="Edit the inputs and expected outputs."
                            number="02"
                        />

                        {/* Visible Test Cases */}
                        <div className="mb-8">
                            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h3 className="font-bold">Visible Test Cases</h3>
                                    <p className="mt-1 text-xs text-base-content/60">
                                        Users can see these examples.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => appendVisible({
                                        input: '',
                                        output: '',
                                        explanation: ''
                                    })}
                                    className="btn btn-primary btn-sm rounded-xl"
                                >
                                    <Plus size={16} /> Add Visible Case
                                </button>
                            </div>

                            <div className="space-y-4">
                                {visibleFields.map((field, index) => (
                                    <div
                                        key={field.id}
                                        className="rounded-xl border border-base-300 bg-base-200/30 p-4 sm:p-5"
                                    >
                                        <div className="mb-4 flex items-center justify-between gap-3">
                                            <h4 className="font-semibold text-sm">
                                                Example {index + 1}
                                            </h4>

                                            <button
                                                type="button"
                                                disabled={visibleFields.length === 1}
                                                onClick={() => removeVisible(index)}
                                                className="btn btn-ghost btn-xs text-error"
                                            >
                                                <Trash2 size={15} /> Remove
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                            <div>
                                                <label className="label">
                                                    <span className={labelClass}>Input</span>
                                                </label>

                                                <textarea
                                                    {...register(`visibleTestCases.${index}.input`)}
                                                    rows={3}
                                                    className={`${textAreaClass} font-mono text-sm`}
                                                    placeholder="Enter sample input"
                                                />

                                                <FieldError message={errors.visibleTestCases?.[index]?.input?.message} />
                                            </div>

                                            <div>
                                                <label className="label">
                                                    <span className={labelClass}>Expected Output</span>
                                                </label>

                                                <textarea
                                                    {...register(`visibleTestCases.${index}.output`)}
                                                    rows={3}
                                                    className={`${textAreaClass} font-mono text-sm`}
                                                    placeholder="Enter expected output"
                                                />

                                                <FieldError message={errors.visibleTestCases?.[index]?.output?.message} />
                                            </div>

                                            <div className="md:col-span-2">
                                                <label className="label">
                                                    <span className={labelClass}>Explanation</span>
                                                </label>

                                                <textarea
                                                    {...register(`visibleTestCases.${index}.explanation`)}
                                                    rows={2}
                                                    className={textAreaClass}
                                                    placeholder="Explain why this output is correct"
                                                />

                                                <FieldError message={errors.visibleTestCases?.[index]?.explanation?.message} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <FieldError message={errors.visibleTestCases?.message} />
                        </div>

                        <div className="divider" />

                        {/* Hidden Test Cases */}
                        <div>
                            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h3 className="font-bold">Hidden Test Cases</h3>
                                    <p className="mt-1 text-xs text-base-content/60">
                                        Used internally to validate solutions.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => appendHidden({
                                        input: '',
                                        output: ''
                                    })}
                                    className="btn btn-outline btn-primary btn-sm rounded-xl"
                                >
                                    <Plus size={16} /> Add Hidden Case
                                </button>
                            </div>

                            <div className="space-y-4">
                                {hiddenFields.map((field, index) => (
                                    <div
                                        key={field.id}
                                        className="rounded-xl border border-base-300 bg-base-200/30 p-4 sm:p-5"
                                    >
                                        <div className="mb-4 flex items-center justify-between gap-3">
                                            <h4 className="font-semibold text-sm">
                                                Hidden Case {index + 1}
                                            </h4>

                                            <button
                                                type="button"
                                                disabled={hiddenFields.length === 1}
                                                onClick={() => removeHidden(index)}
                                                className="btn btn-ghost btn-xs text-error"
                                            >
                                                <Trash2 size={15} /> Remove
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                            <div>
                                                <label className="label">
                                                    <span className={labelClass}>Input</span>
                                                </label>

                                                <textarea
                                                    {...register(`hiddenTestCases.${index}.input`)}
                                                    rows={3}
                                                    className={`${textAreaClass} font-mono text-sm`}
                                                    placeholder="Enter test input"
                                                />

                                                <FieldError message={errors.hiddenTestCases?.[index]?.input?.message} />
                                            </div>

                                            <div>
                                                <label className="label">
                                                    <span className={labelClass}>Expected Output</span>
                                                </label>

                                                <textarea
                                                    {...register(`hiddenTestCases.${index}.output`)}
                                                    rows={3}
                                                    className={`${textAreaClass} font-mono text-sm`}
                                                    placeholder="Enter expected output"
                                                />

                                                <FieldError message={errors.hiddenTestCases?.[index]?.output?.message} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <FieldError message={errors.hiddenTestCases?.message} />
                        </div>
                    </section>

                    {/* 03 - Code Templates & Solutions */}
                    <section className={`${sectionClass} p-5 sm:p-7`}>
                        <SectionHeading
                            icon={Braces}
                            title="Code Templates & Solutions"
                            description="Edit starter code and reference solutions."
                            number="03"
                        />

                        <div className="space-y-6">
                            {languages.map((language, index) => (
                                <div
                                    key={language.name}
                                    className="overflow-hidden rounded-xl border border-base-300"
                                >
                                    <div className="flex items-center gap-3 border-b border-base-300 bg-base-200/50 px-4 py-4">
                                        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${language.badge} ${language.color}`}>
                                            <Code2 size={20} />
                                        </div>

                                        <div>
                                            <h3 className="font-bold">{language.name}</h3>
                                            <p className="text-xs text-base-content/60">
                                                Code configuration
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-5 p-4 sm:p-5 lg:grid-cols-2">
                                        <div className="min-w-0">
                                            <label className="mb-2 flex items-center gap-2 text-sm font-semibold">
                                                <span className="h-2 w-2 rounded-full bg-primary" />
                                                Initial Code
                                            </label>

                                            <p className="mb-3 text-xs text-base-content/60">
                                                Starter code provided to users.
                                            </p>

                                            <div className="overflow-hidden rounded-xl border border-slate-700 bg-slate-950">
                                                <div className="flex items-center gap-1.5 border-b border-slate-700 px-4 py-3">
                                                    <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                                                    <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                                                    <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
                                                    <span className="ml-auto text-xs text-slate-400">{language.name}</span>
                                                </div>

                                                <textarea
                                                    {...register(`startCode.${index}.initialCode`)}
                                                    spellCheck={false}
                                                    placeholder={`// Write ${language.name} starter code...`}
                                                    className="min-h-56 w-full resize-y bg-transparent p-4 font-mono text-sm leading-6 text-slate-100 outline-none placeholder:text-slate-500"
                                                />
                                            </div>

                                            <FieldError message={errors.startCode?.[index]?.initialCode?.message} />
                                        </div>

                                        <div className="min-w-0">
                                            <label className="mb-2 flex items-center gap-2 text-sm font-semibold">
                                                <span className="h-2 w-2 rounded-full bg-success" />
                                                Reference Solution
                                            </label>

                                            <p className="mb-3 text-xs text-base-content/60">
                                                Complete solution used for evaluation.
                                            </p>

                                            <div className="overflow-hidden rounded-xl border border-slate-700 bg-slate-950">
                                                <div className="flex items-center gap-1.5 border-b border-slate-700 px-4 py-3">
                                                    <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                                                    <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                                                    <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
                                                    <span className="ml-auto text-xs text-slate-400">Solution</span>
                                                </div>

                                                <textarea
                                                    {...register(`referenceSolution.${index}.completeCode`)}
                                                    spellCheck={false}
                                                    placeholder={`// Write complete ${language.name} solution...`}
                                                    className="min-h-56 w-full resize-y bg-transparent p-4 font-mono text-sm leading-6 text-slate-100 outline-none placeholder:text-slate-500"
                                                />
                                            </div>

                                            <FieldError message={errors.referenceSolution?.[index]?.completeCode?.message} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Bottom Actions */}
                    <div className="flex flex-col-reverse gap-3 rounded-2xl border border-base-300 bg-base-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                        <p className="flex items-center gap-2 text-xs text-base-content/60">
                            <CheckCircle2 size={16} className="text-success" />
                            Review all changes before updating the problem.
                        </p>

                        <div className="flex flex-col gap-3 sm:flex-row">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="btn btn-ghost rounded-xl"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="btn btn-primary min-w-48 rounded-xl shadow-sm"
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="loading loading-spinner loading-sm" />
                                        Updating Problem...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 size={18} />
                                        Update Problem
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AdminEditProblem
