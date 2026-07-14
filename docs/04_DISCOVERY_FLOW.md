# AI Project Architect

# Discovery Flow

## 1. Purpose

The Discovery Flow defines the complete Software Requirements Discovery process used by AI Project Architect.

Its purpose is to transform an initial software idea into complete, verified, and implementation-ready engineering documentation.

Rather than collecting random information, the discovery process follows a structured engineering methodology that progressively reduces uncertainty until every critical aspect of the project has been documented.

Discovery is the foundation upon which every later engineering decision depends.

---

# 2. Discovery Philosophy

AI Project Architect treats discovery as an engineering discipline rather than a simple conversation.

The objective is not to ask as many questions as possible.

The objective is to ask only the questions necessary to fully understand the project.

Every question should increase understanding.

Every answer should reduce uncertainty.

Every engineering decision should be supported by documented information.

If sufficient information already exists, the AI should continue without asking unnecessary questions.

---

# 3. Engineering Principles

The discovery process follows several mandatory engineering principles.

## Understand Before Building

The AI must understand the business before discussing technology.

Technology decisions should never drive business requirements.

---

## Business Before Features

Every feature must solve a documented business problem.

Features without business value should not be included.

---

## Documentation Before Implementation

Implementation is forbidden until discovery has been completed and documentation has been approved.

---

## Validation Before Progression

Every discovery stage must be validated before moving to the next stage.

Incomplete knowledge must never propagate through the engineering process.

---

## No Assumptions

The AI must never invent:

- Business requirements
- User roles
- Business Rules
- Workflows
- Integrations
- Technical constraints

When information is missing, the AI must ask concise follow-up questions.

---

# 4. Discovery Objectives

The discovery process aims to:

- Understand the client's business.
- Identify the real business problem.
- Define project goals.
- Discover user roles.
- Identify functional requirements.
- Identify non-functional requirements.
- Extract business rules.
- Detect hidden requirements.
- Eliminate ambiguity.
- Validate collected information.
- Prepare complete engineering documentation.

Discovery is considered successful only when implementation can begin without major unanswered questions.

---

# 5. High-Level Discovery Workflow

Every project follows the same high-level discovery sequence.

```

Client Idea

↓

Business Discovery

↓

Business Analysis

↓

Requirement Discovery

↓

Requirement Validation

↓

Business Rule Extraction

↓

Project Classification

↓

Architecture Preparation

↓

Documentation Generation

↓

Engineering Review

↓

Repository Generation

↓

Software Development

```

Each stage depends on the successful completion of the previous stage.

Skipping discovery stages is not permitted because it increases engineering risk.

---

# 6. Discovery Success Criteria

The discovery process is complete only when:

- The business problem is clearly understood.
- Project objectives are documented.
- User roles are identified.
- Functional requirements are complete.
- Non-functional requirements are defined.
- Business Rules are validated.
- Project scope is approved.
- Technical uncertainties are resolved.
- Documentation has been generated.
- AI can accurately explain the project before implementation begins.

Only after these conditions have been satisfied should the engineering workflow proceed to architecture planning and software development.
# 7. Discovery Stages

The discovery process is divided into sequential engineering stages.

Each stage has a specific objective, required inputs, expected outputs, and validation rules.

A stage cannot begin until the previous stage has been completed.

---

# Stage 1 — Business Discovery

## Objective

Understand the client's business before discussing software.

The AI should identify why the project exists rather than immediately asking about features.

---

## Information to Collect

- Business domain
- Organization type
- Industry
- Existing workflow
- Current problems
- Business goals
- Target audience
- Expected business outcomes

---

## Expected Output

- Business Summary
- Business Objectives
- Stakeholders
- Initial Problem Statement

---

## Validation Rules

The AI should confirm that:

- The business problem is clearly understood.
- The business objectives are measurable.
- The target users are identified.

Only then should the workflow continue.

---

# Stage 2 — Project Definition

## Objective

Define the software project at a high level.

The AI determines what type of system will be built.

---

## Information to Collect

- Project type
- Platform
- Target devices
- Primary purpose
- Expected users
- Initial feature list
- Expected integrations

---

## Expected Output

- Project Overview
- Initial Scope
- Project Classification Input

---

## Validation Rules

The AI must ensure:

- The project type is identified.
- The primary platform is known.
- The business objective matches the selected solution.

---

# Stage 3 — User Discovery

## Objective

Identify every actor interacting with the software.

The AI should understand each user's responsibilities rather than only listing user types.

---

## Information to Collect

For every user:

- Role
- Responsibilities
- Permissions
- Goals
- Typical workflow
- Access level

---

## Expected Output

- User Personas
- User Roles
- Permission Matrix

---

## Validation Rules

The AI must verify that:

- Every business process has an owner.
- Every user role has clear responsibilities.
- Duplicate roles are removed.

---

# Stage 4 — Functional Requirements Discovery

## Objective

Discover everything the software must do.

The AI should focus on user behavior and business functionality instead of implementation details.

---

## Information to Collect

- Features
- User actions
- Business workflows
- CRUD operations
- Notifications
- Reports
- Dashboards
- Search functionality
- Authentication
- Authorization
- External integrations

---

## Expected Output

- Functional Requirements
- Feature List
- Module Candidates

---

## Validation Rules

Every feature should answer:

- Which user needs it?
- Which business problem does it solve?
- Is it mandatory?
- Is it optional?
- Does it introduce new modules?

Features without business value should be removed.

---

# Stage 5 — Non-Functional Requirements Discovery

## Objective

Identify engineering qualities that define how the software should operate.

---

## Information to Collect

- Performance
- Security
- Availability
- Scalability
- Reliability
- Accessibility
- Localization
- Compliance
- Maintainability

---

## Expected Output

- Non-Functional Requirements
- Quality Attributes
- Engineering Constraints

---

## Validation Rules

The AI should ensure that quality expectations are realistic, measurable, and aligned with business objectives.

---

# Stage 6 — Business Rule Discovery

## Objective

Identify the rules governing the business rather than the software.

Business Rules define how the organization operates independently of technology.

---

## Information to Collect

- Approval rules
- Validation rules
- Pricing rules
- Permission rules
- Workflow rules
- Time restrictions
- Legal requirements
- Exception handling

---

## Expected Output

- Business Rules
- Validation Rules
- Operational Constraints

---

## Validation Rules

The AI must distinguish between:

- Business Rules
- Technical implementation
- User preferences

Only genuine business policies should be documented as Business Rules.
# 8. Dynamic Question Engine

The Dynamic Question Engine is the core intelligence of AI Project Architect.

Unlike traditional questionnaires that present a fixed list of questions, the Dynamic Question Engine generates adaptive questions based on the information already collected.

The objective is to maximize information quality while minimizing unnecessary interaction with the client.

Every new question must have a clear engineering purpose.

---

# 9. Adaptive Discovery Strategy

The AI must continuously evaluate the current state of project understanding.

For every response received, the AI should determine whether:

- The information is complete.
- Additional clarification is required.
- The answer introduces new engineering topics.
- The answer affects previous requirements.
- The answer changes project classification.
- The answer introduces engineering risks.

Only unanswered engineering topics should generate additional questions.

---

# 10. Question Categories

Every generated question belongs to one of the following categories.

## Business Questions

Purpose:

Understand the client's business.

Examples:

- What business problem are you solving?
- Who are your customers?
- How does the current process work?

---

## Functional Questions

Purpose:

Understand software behavior.

Examples:

- What should users be able to do?
- What actions are available?
- What information should be stored?

---

## Business Rule Questions

Purpose:

Discover operational rules.

Examples:

- Who can approve requests?
- Are there time restrictions?
- Are there pricing rules?
- Are there validation rules?

---

## Technical Questions

Purpose:

Collect engineering constraints.

Examples:

- Which platforms are required?
- Are external APIs needed?
- Are there security requirements?

---

## Validation Questions

Purpose:

Confirm understanding.

Examples:

- Did I correctly understand this workflow?
- Is this requirement mandatory?
- Should this apply to every user?

---

# 11. Question Prioritization

Questions should be generated according to engineering priority.

Priority 1

Critical information required for understanding the project.

Examples:

- Business objective
- Project type
- Primary users

---

Priority 2

Information required for system design.

Examples:

- Features
- Workflows
- Roles
- Permissions

---

Priority 3

Information required for implementation planning.

Examples:

- Notifications
- Reports
- Integrations
- Search
- Filters

---

Priority 4

Optional improvements.

Examples:

- Future ideas
- Nice-to-have features
- Version 2 functionality

Optional questions should never interrupt the primary discovery process.

---

# 12. Intelligent Follow-Up Questions

The AI should never ask unrelated questions.

Instead, every follow-up question must originate from previous answers.

Example

Client:

"I want a hotel reservation system."

AI should continue with questions such as:

- Will guests book rooms online?
- Will administrators manage reservations?
- Will online payment be supported?
- Can users cancel reservations?
- Are multiple hotel branches supported?

The AI should progressively deepen understanding without changing the conversation topic unexpectedly.

---

# 13. Duplicate Question Prevention

Before generating any question, the AI must verify whether the required information has already been collected.

The AI must never:

- Repeat identical questions.
- Ask for previously confirmed information.
- Request information already documented.
- Ignore validated answers.

If sufficient information already exists, the discovery process should continue automatically.

---

# 14. Ambiguity Detection

The AI should continuously detect ambiguous information.

Examples include:

- Vague feature descriptions.
- Undefined user roles.
- Missing business rules.
- Conflicting requirements.
- Undefined approval processes.
- Incomplete workflows.

Whenever ambiguity is detected, the AI should immediately generate targeted clarification questions before continuing.

---

# 15. Decision Logic

After every client response, the AI should execute the following decision process.

Receive Answer

↓

Analyze Information

↓

Detect Missing Data

↓

Detect Conflicts

↓

Determine Next Discovery Stage

↓

Generate Only Necessary Questions

↓

Validate Responses

↓

Update Engineering Knowledge

↓

Continue Discovery

This decision loop repeats until every required engineering topic has been completed.

---

# 16. Discovery Intelligence Rules

The AI should always:

- Ask the minimum number of questions required.
- Prefer quality over quantity.
- Build upon previous answers.
- Detect hidden requirements.
- Identify engineering risks early.
- Validate assumptions immediately.
- Adapt the conversation dynamically.
- Keep the client focused on business rather than technology.

The Dynamic Question Engine should behave like an experienced Requirements Engineer conducting a professional project discovery session rather than a static questionnaire.
# 17. Requirement Validation

Collecting information is only the first step of discovery.

Before documentation can be generated, every collected requirement must be validated.

Validation ensures that the project is complete, internally consistent, and ready for engineering.

The AI must verify both the correctness and completeness of every requirement.

---

# 18. Validation Process

Every requirement should pass the following validation pipeline.

Requirement Collected

↓

Completeness Check

↓

Consistency Check

↓

Business Value Check

↓

Dependency Analysis

↓

Risk Analysis

↓

Stakeholder Confirmation

↓

Requirement Approved

A requirement should never be marked as approved until every validation step has been completed.

---

# 19. Consistency Analysis

The AI should continuously compare newly collected information with existing knowledge.

It must detect:

- Contradicting requirements
- Duplicate features
- Missing user roles
- Missing permissions
- Conflicting workflows
- Invalid business rules
- Impossible feature combinations
- Missing dependencies

Whenever inconsistencies are detected, discovery should pause until they are resolved.

---

# 20. Project Classification

Once sufficient information has been collected, the AI must classify the project.

Project classification determines:

- Repository structure
- Documentation depth
- Required engineering artifacts
- Module complexity
- Architecture recommendations
- Development strategy

The classification process should consider:

- Business domain
- Project size
- Number of modules
- User roles
- External integrations
- Technical complexity
- Expected scalability
- Security requirements

The classification result becomes part of the project's engineering documentation.

---

# 21. Complexity Assessment

Every project should receive a complexity rating.

The rating helps determine engineering effort and repository structure.

Typical complexity levels include:

Tiny

- Landing Pages
- Portfolio Websites
- Single-purpose Tools

---

Small

- Booking Systems
- Restaurant Websites
- Clinic Websites
- School Websites

---

Medium

- CRM Systems
- HR Systems
- Inventory Systems
- Marketplace Platforms

---

Large

- ERP Systems
- Multi-tenant SaaS Platforms
- Healthcare Systems
- Banking Platforms
- Government Systems

---

Enterprise

- Distributed Systems
- Large Enterprise Platforms
- Mission-Critical Infrastructure
- Multi-organization Platforms

Complexity should always be determined by engineering requirements rather than project description alone.

---

# 22. Documentation Generation

After successful validation and classification, AI Project Architect begins generating engineering documentation.

Documentation must be created in a logical sequence.

The recommended generation order is:

1. Vision
2. Project Scope
3. User Personas
4. Discovery Summary
5. Requirements
6. Business Rules
7. Modules
8. Database Design
9. API Specification
10. UI/UX Guidelines
11. Tasks
12. Roadmap
13. Testing Strategy

Every document should reference information produced during previous discovery stages.

No document should introduce undocumented assumptions.

---

# 23. Repository Preparation

Once documentation has been completed, the AI prepares the repository structure.

The generated repository should match the project's classification and engineering complexity.

Repository preparation includes:

- Selecting the appropriate repository template.
- Generating documentation files.
- Creating engineering folders.
- Preparing prompt libraries.
- Preparing knowledge assets.
- Preparing schema definitions.
- Preparing implementation instructions for AI Coding Agents.

The repository should be fully prepared before software development begins.

---

# 24. Engineering Review

Before exporting the project, the AI performs a final engineering review.

The review verifies that:

- Every required document exists.
- All requirements are traceable.
- Business Rules are complete.
- Modules are consistent.
- Database design matches requirements.
- API specifications are complete.
- Documentation contains no contradictions.
- The repository is ready for implementation.

Only after a successful engineering review should the project proceed to the export stage.
# 25. Discovery Completion Rules

The discovery process is considered complete only when all critical engineering information has been collected, validated, and documented.

Completion is determined by engineering readiness rather than the number of questions asked.

The AI must verify that no unresolved uncertainty remains before allowing the project to proceed.

The objective is to ensure that implementation can begin with confidence and without major requirement gaps.

---

# 26. Discovery Completion Checklist

Before discovery can be marked as complete, the following conditions must be satisfied.

## Business

✓ Business problem identified

✓ Business objectives documented

✓ Success criteria defined

✓ Stakeholders identified

✓ Target users identified

---

## Project Definition

✓ Project type confirmed

✓ Project scope approved

✓ Project classification completed

✓ Complexity level determined

---

## Requirements

✓ Functional requirements completed

✓ Non-functional requirements completed

✓ User roles documented

✓ Permissions identified

✓ Workflows documented

---

## Business Rules

✓ Validation rules documented

✓ Approval rules documented

✓ Operational constraints identified

✓ Exception scenarios documented

---

## Technical Planning

✓ Modules identified

✓ Database planning completed

✓ API planning completed

✓ External integrations documented

✓ Security requirements identified

---

## Documentation

✓ All engineering documents generated

✓ Internal consistency verified

✓ No unresolved conflicts

✓ Documentation reviewed

---

## AI Readiness

✓ AI understands the complete project

✓ AI can explain the business

✓ AI can explain the architecture

✓ AI can explain every major module

✓ AI is ready for implementation

Only after every checklist item has been verified should discovery be considered complete.

---

# 27. Failure Handling

Discovery should stop immediately whenever critical engineering issues are detected.

Examples include:

- Missing business objectives
- Undefined project scope
- Conflicting requirements
- Undefined user roles
- Missing Business Rules
- Incomplete workflows
- Contradictory stakeholder decisions

The AI should never continue while critical engineering uncertainties remain unresolved.

Instead, it should explain the issue, request clarification, update the engineering knowledge, and continue only after validation.

---

# 28. Recovery Strategy

When discovery cannot continue because of incomplete information, AI Project Architect should recover using a structured approach.

Recovery process:

Identify the missing information

↓

Explain why it is required

↓

Ask the minimum number of clarification questions

↓

Validate the new information

↓

Update documentation

↓

Resume discovery from the correct stage

The AI should never restart the entire discovery process unless the project itself has fundamentally changed.

---

# 29. Engineering Quality Standards

Every discovery session must satisfy the following quality standards.

Completeness

Every important engineering topic has been covered.

---

Consistency

No contradictions exist across documentation.

---

Traceability

Every engineering decision can be traced back to documented requirements.

---

Accuracy

Business knowledge has been validated with stakeholders.

---

Maintainability

Documentation can be updated without affecting unrelated engineering artifacts.

---

Scalability

The generated documentation supports future project growth.

---

Implementation Readiness

Developers and AI Coding Agents can begin implementation without performing additional business analysis.

---

# 30. Final Discovery Workflow

The complete engineering workflow followed by AI Project Architect is:

Idea

↓

Business Discovery

↓

Business Analysis

↓

Project Definition

↓

User Discovery

↓

Requirements Discovery

↓

Business Rule Discovery

↓

Requirement Validation

↓

Project Classification

↓

Complexity Assessment

↓

Documentation Generation

↓

Repository Preparation

↓

Engineering Review

↓

Project Export

↓

AI Coding Agent

↓

Software Development

↓

Testing

↓

Deployment

Every generated software project must follow this workflow.

Skipping engineering stages increases project risk and reduces software quality.

---

# 31. Discovery Principles

The Discovery Flow is the foundation of AI Project Architect.

The platform does not measure success by how quickly code is generated.

Success is measured by how accurately the project has been understood.

The AI should think like an experienced Requirements Engineer, Business Analyst, and Software Architect before acting as a code generator.

Every question should have purpose.

Every answer should improve understanding.

Every document should reduce uncertainty.

Every engineering decision should be supported by validated information.

Only after complete understanding has been achieved should implementation begin.

Discovery is not a preliminary step.

It is the most important phase of the Software Engineering lifecycle and serves as the single source of truth for every engineering activity that follows.