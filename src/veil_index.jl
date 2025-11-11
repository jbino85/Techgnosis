"""
veil_index.jl

Complete catalog lookup, search, and export system for 777 veils.
Provides fast access by ID, tier, opcode, or keyword search.
"""

module VeilIndex

include("veils_777.jl")
using .Veils777
using JSON3

# ═══════════════════════════════════════════════════════════════════════════════
# LOOKUP FUNCTIONS
# ═══════════════════════════════════════════════════════════════════════════════

"""
    lookup_veil(veil_id::Int) :: VeilDefinition

Retrieve a veil definition by ID. Returns placeholder if not yet defined.
"""
function lookup_veil(veil_id::Int)::VeilDefinition
    if haskey(VEIL_CATALOG, veil_id)
        return VEIL_CATALOG[veil_id]
    else
        return create_placeholder_veil(veil_id)
    end
end

"""
    search_veils(query::String) :: Vector{VeilDefinition}

Search for veils by name, description, tags, or equation.
Returns all matching veils (case-insensitive).
"""
function search_veils(query::String)::Vector{VeilDefinition}
    query_lower = lowercase(query)
    results = VeilDefinition[]
    
    # Search all veils in catalog
    for (id, veil) in VEIL_CATALOG
        # Check multiple fields
        if (lowercase(veil.name) |> contains(query_lower)) ||
           (lowercase(veil.description) |> contains(query_lower)) ||
           (lowercase(veil.category) |> contains(query_lower)) ||
           (any(lowercase(tag) |> contains(query_lower) for tag in veil.tags))
            push!(results, veil)
        end
    end
    
    # Also search placeholders for unmapped IDs if query is numeric
    if tryparse(Int, query) !== nothing
        id = parse(Int, query)
        if 1 <= id <= 777 && !haskey(VEIL_CATALOG, id)
            push!(results, create_placeholder_veil(id))
        end
    end
    
    # Sort by ID
    sort!(results, by=v -> v.id)
    return results
end

"""
    veil_by_tier(tier::String) :: Vector{VeilDefinition}

Retrieve all veils in a specific tier.
Returns empty vector if tier not found.
"""
function veil_by_tier(tier::String)::Vector{VeilDefinition}
    # Normalize tier name
    tier_lower = lowercase(replace(tier, r"[\s_-]" => "_"))
    
    if !haskey(VEIL_TIERS, tier_lower)
        return VeilDefinition[]
    end
    
    start_id, end_id = VEIL_TIERS[tier_lower]
    results = VeilDefinition[]
    
    for id in start_id:end_id
        push!(results, lookup_veil(id))
    end
    
    return results
end

"""
    veil_by_opcode(opcode::String) :: Union{VeilDefinition, Nothing}

Retrieve a veil by its hex opcode.
"""
function veil_by_opcode(opcode::String)::Union{VeilDefinition, Nothing}
    for (id, veil) in VEIL_CATALOG
        if uppercase(veil.opcode) == uppercase(opcode)
            return veil
        end
    end
    return nothing
end

"""
    veil_by_tag(tag::String) :: Vector{VeilDefinition}

Retrieve all veils with a specific tag.
"""
function veil_by_tag(tag::String)::Vector{VeilDefinition}
    tag_lower = lowercase(tag)
    results = VeilDefinition[]
    
    for (id, veil) in VEIL_CATALOG
        if any(lowercase(t) == tag_lower for t in veil.tags)
            push!(results, veil)
        end
    end
    
    return sort!(results, by=v -> v.id)
end

"""
    veil_by_ffi_language(language::String) :: Vector{VeilDefinition}

Retrieve all veils implemented in a specific language.
"""
function veil_by_ffi_language(language::String)::Vector{VeilDefinition}
    lang_lower = lowercase(language)
    results = VeilDefinition[]
    
    for (id, veil) in VEIL_CATALOG
        if lowercase(veil.ffi_language) == lang_lower
            push!(results, veil)
        end
    end
    
    return sort!(results, by=v -> v.id)
end

# ═══════════════════════════════════════════════════════════════════════════════
# AGGREGATION FUNCTIONS
# ═══════════════════════════════════════════════════════════════════════════════

"""
    get_all_tiers() :: Vector{String}

Return list of all veil tier names.
"""
function get_all_tiers()::Vector{String}
    return collect(keys(VEIL_TIERS))
end

"""
    get_tier_bounds(tier::String) :: Union{Tuple{Int,Int}, Nothing}

Get the start and end IDs for a tier.
"""
function get_tier_bounds(tier::String)::Union{Tuple{Int,Int}, Nothing}
    tier_lower = lowercase(replace(tier, r"[\s_-]" => "_"))
    if haskey(VEIL_TIERS, tier_lower)
        return VEIL_TIERS[tier_lower]
    end
    return nothing
end

"""
    count_implemented_veils() :: Int

Count how many veils are currently implemented in the catalog.
"""
function count_implemented_veils()::Int
    return length(VEIL_CATALOG)
end

"""
    count_total_veils() :: Int

Return total number of veils (777).
"""
function count_total_veils()::Int
    return 777
end

"""
    get_completion_percentage() :: Float64

Return percentage of veils currently implemented.
"""
function get_completion_percentage()::Float64
    return (count_implemented_veils() / count_total_veils()) * 100.0
end

"""
    get_implementation_by_language() :: Dict{String, Int}

Count veils implemented in each language.
"""
function get_implementation_by_language()::Dict{String, Int}
    counts = Dict{String, Int}()
    
    for (id, veil) in VEIL_CATALOG
        lang = veil.ffi_language
        counts[lang] = get(counts, lang, 0) + 1
    end
    
    return counts
end

"""
    get_implementation_by_tier() :: Dict{String, Int}

Count implemented veils in each tier.
"""
function get_implementation_by_tier()::Dict{String, Int}
    counts = Dict{String, Int}()
    
    for (id, veil) in VEIL_CATALOG
        tier = veil.tier
        counts[tier] = get(counts, tier, 0) + 1
    end
    
    return counts
end

# ═══════════════════════════════════════════════════════════════════════════════
# JSON EXPORT FUNCTIONS
# ═══════════════════════════════════════════════════════════════════════════════

"""
    veil_to_dict(veil::VeilDefinition) :: Dict

Convert a VeilDefinition to a dictionary for JSON export.
"""
function veil_to_dict(veil::VeilDefinition)::Dict
    return Dict(
        "id" => veil.id,
        "name" => veil.name,
        "tier" => veil.tier,
        "description" => veil.description,
        "equation" => veil.equation,
        "category" => veil.category,
        "opcode" => veil.opcode,
        "ffi_language" => veil.ffi_language,
        "parameters" => [Dict("name" => pair.first, "type" => pair.second) 
                        for pair in veil.parameters],
        "outputs" => [Dict("name" => pair.first, "type" => pair.second) 
                     for pair in veil.outputs],
        "implementation_file" => veil.implementation_file,
        "tags" => veil.tags,
        "references" => veil.references,
        "sacred_mapping" => veil.sacred_mapping
    )
end

"""
    export_veil_json(filename::String = "veils_777.json") :: String

Export all implemented veils to a JSON file.
Returns the path to the created file.
"""
function export_veil_json(filename::String = "veils_777.json")::String
    # Collect all veil data
    veils_data = Dict(
        "metadata" => Dict(
            "total_veils" => 777,
            "implemented_veils" => count_implemented_veils(),
            "completion_percentage" => get_completion_percentage(),
            "exported_at" => string(now()),
            "genesis_time" => SacredGeometry.VEIL_GENESIS_TIME
        ),
        "implementation_by_language" => get_implementation_by_language(),
        "implementation_by_tier" => get_implementation_by_tier(),
        "tiers" => collect(keys(VEIL_TIERS)),
        "veils" => [veil_to_dict(veil) for (id, veil) in sort(VEIL_CATALOG)]
    )
    
    # Write JSON file
    open(filename, "w") do f
        JSON3.write(f, veils_data)
    end
    
    return abspath(filename)
end

"""
    export_veil_markdown(filename::String = "VEILS_CATALOG.md") :: String

Export all implemented veils to a markdown file for documentation.
"""
function export_veil_markdown(filename::String = "VEILS_CATALOG.md")::String
    lines = String[]
    
    push!(lines, "# 🤍🗿⚖️🕊️🌄 THE 777 VEILS - COMPLETE CATALOG")
    push!(lines, "")
    push!(lines, "**Generated**: $(now())")
    push!(lines, "**Total Veils**: 777")
    push!(lines, "**Implemented**: $(count_implemented_veils()) ($(round(get_completion_percentage(), digits=1))%)")
    push!(lines, "")
    
    # Statistics
    push!(lines, "## STATISTICS")
    push!(lines, "")
    push!(lines, "### By Language")
    push!(lines, "")
    for (lang, count) in sort(get_implementation_by_language())
        push!(lines, "- **$lang**: $count veils")
    end
    push!(lines, "")
    
    push!(lines, "### By Tier")
    push!(lines, "")
    for tier in sort(get_all_tiers())
        count = length(veil_by_tier(tier))
        if count > 0
            push!(lines, "- **$tier**: $count veils")
        end
    end
    push!(lines, "")
    
    # Organized by tier
    for tier in sort(get_all_tiers())
        veils = veil_by_tier(tier)
        if !isempty(veils)
            bounds = get_tier_bounds(tier)
            push!(lines, "## $(uppercase(tier)) (Veils $(bounds[1])–$(bounds[2]))")
            push!(lines, "")
            
            for veil in veils
                push!(lines, "### Veil #$(veil.id): $(veil.name)")
                push!(lines, "")
                push!(lines, "**Description**: $(veil.description)")
                push!(lines, "")
                push!(lines, "**Equation**: `$(veil.equation)`")
                push!(lines, "")
                push!(lines, "**Opcode**: `$(veil.opcode)`")
                push!(lines, "")
                push!(lines, "**FFI Language**: $(veil.ffi_language)")
                push!(lines, "")
                
                if !isempty(veil.parameters)
                    push!(lines, "**Parameters**:")
                    for param in veil.parameters
                        push!(lines, "- `$(param.first)` : $(param.second)")
                    end
                    push!(lines, "")
                end
                
                if !isempty(veil.outputs)
                    push!(lines, "**Outputs**:")
                    for output in veil.outputs
                        push!(lines, "- `$(output.first)` : $(output.second)")
                    end
                    push!(lines, "")
                end
                
                if !isempty(veil.tags)
                    push!(lines, "**Tags**: `$(join(veil.tags, "`, `"))`")
                    push!(lines, "")
                end
                
                if !isempty(veil.sacred_mapping)
                    push!(lines, "**Sacred Mapping**: $(veil.sacred_mapping)")
                    push!(lines, "")
                end
                
                push!(lines, "---")
                push!(lines, "")
            end
        end
    end
    
    # Write markdown file
    open(filename, "w") do f
        write(f, join(lines, "\n"))
    end
    
    return abspath(filename)
end

# ═══════════════════════════════════════════════════════════════════════════════
# TESTING & VALIDATION
# ═══════════════════════════════════════════════════════════════════════════════

"""
    validate_veil_integrity() :: Tuple{Bool, Vector{String}}

Check veil catalog for consistency issues.
Returns (is_valid, list_of_errors).
"""
function validate_veil_integrity()::Tuple{Bool, Vector{String}}
    errors = String[]
    
    # Check for duplicate IDs
    ids = [v.id for (id, v) in VEIL_CATALOG]
    if length(ids) != length(unique(ids))
        push!(errors, "Duplicate veil IDs found")
    end
    
    # Check for IDs outside 1-777 range
    for (id, veil) in VEIL_CATALOG
        if veil.id < 1 || veil.id > 777
            push!(errors, "Veil #$(veil.id) outside valid range [1, 777]")
        end
    end
    
    # Check for empty required fields
    for (id, veil) in VEIL_CATALOG
        if isempty(veil.name)
            push!(errors, "Veil #$id: missing name")
        end
        if isempty(veil.tier)
            push!(errors, "Veil #$id: missing tier")
        end
        if isempty(veil.opcode)
            push!(errors, "Veil #$id: missing opcode")
        end
    end
    
    return (isempty(errors), errors)
end

"""
    print_summary() :: Nothing

Print a summary of the veil catalog status.
"""
function print_summary()::Nothing
    println("═══════════════════════════════════════════════════════════════════")
    println("🤍🗿⚖️🕊️🌄 VEIL CATALOG STATUS 🤍🗿⚖️🕊️🌄")
    println("═══════════════════════════════════════════════════════════════════")
    println()
    println("Total Veils: $(count_total_veils())")
    println("Implemented: $(count_implemented_veils())")
    println("Completion: $(round(get_completion_percentage(), digits=1))%")
    println()
    println("By Language:")
    for (lang, count) in sort(get_implementation_by_language())
        println("  $lang: $count")
    end
    println()
    println("By Tier:")
    for (tier, count) in sort(get_implementation_by_tier())
        println("  $tier: $count")
    end
    println()
    
    is_valid, errors = validate_veil_integrity()
    if is_valid
        println("✅ Catalog integrity: VALID")
    else
        println("❌ Catalog integrity: INVALID")
        for err in errors
            println("  - $err")
        end
    end
    println()
    println("═══════════════════════════════════════════════════════════════════")
end

# ═══════════════════════════════════════════════════════════════════════════════
# EXPORTS
# ═══════════════════════════════════════════════════════════════════════════════

export lookup_veil, search_veils, veil_by_tier, veil_by_opcode, veil_by_tag
export veil_by_ffi_language
export get_all_tiers, get_tier_bounds
export count_implemented_veils, count_total_veils, get_completion_percentage
export get_implementation_by_language, get_implementation_by_tier
export veil_to_dict, export_veil_json, export_veil_markdown
export validate_veil_integrity, print_summary

end # module VeilIndex
