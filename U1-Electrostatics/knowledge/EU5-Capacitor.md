# Capacitors (电容器)

## Definition (定义)

A **capacitor** is a device that stores electric charge and energy in an electric field.

### Basic Structure (基本结构)
- Two parallel conducting plates
- Separated by an insulator (dielectric)
- Stores charge on its plates

---

## Capacitance (电容)

### Definition (定义)
$$C = \frac{Q}{V}$$

Where:
- C: Capacitance (Farad, F)
- Q: Charge on each plate (C)
- V: Potential difference between plates (V)

### Unit (单位)
- **Farad (F)** - but too large, usually use:
  - μF = 10⁻⁶ F
  - nF = 10⁻⁹ F
  - pF = 10⁻¹² F

---

## Capacitance of Parallel Plates (平行板电容器)

### Formula (公式)
$$C = \frac{\varepsilon_0 A}{d}$$

Where:
- A: Area of each plate (m²)
- d: Separation between plates (m)
- ε₀: Permittivity of free space (8.85 × 10⁻¹² F/m)

### With Dielectric (有电介质时)
$$C = \frac{\kappa \varepsilon_0 A}{d}$$

Where κ = dielectric constant

---

## Energy Stored in Capacitor (电容器储存的能量)

### Formula (公式)
$$U = \frac{1}{2}CV^2 = \frac{Q^2}{2C} = \frac{1}{2}QV$$

### Energy Density (能量密度)
$$u = \frac{1}{2}\varepsilon_0 E^2$$ (for vacuum)

---

## Charging a Capacitor (充电过程)

When connected to battery:
1. Electrons move from one plate to the other
2. Current decreases as charge builds up
3. Voltage increases proportionally (V = Q/C)
4. Fully charged: current stops, V = EMF of battery

**Charging curve:**
```
I → 0 (decreasing)
Q → Qmax (increasing)
V → Vmax (increasing)
```

---

## Discharging a Capacitor (放电过程)

When connected to resistor:
1. Current flows from negative to positive plate
2. Current decreases exponentially
3. Charge, voltage decrease exponentially

$$Q = Q_0 e^{-t/RC}$$

Where RC = time constant

---

## Combinations (组合)

### Parallel Combination (并联)
$$C_{eq} = C_1 + C_2 + C_3 + ...$$

### Series Combination (串联)
$$\frac{1}{C_{eq}} = \frac{1}{C_1} + \frac{1}{C_2} + \frac{1}{C_3} + ...$$

---

## Dielectric (电介质)

### Function (作用)
- Increases capacitance by factor of κ (dielectric constant)
- Prevents sparking between plates
- Can be polarized by electric field

### Types (类型)
- Vacuum: κ = 1
- Air: κ ≈ 1.0006
- Glass: κ = 5-10
- Water: κ ≈ 80

---

## Key Formulas (重要公式)

1. $C = Q/V$ (definition)
2. $C = \varepsilon_0 A/d$ (parallel plates)
3. $U = \frac{1}{2}CV^2$ (energy)
4. $Q = Q_0 e^{-t/RC}$ (discharging)
5. Parallel: $C_{eq} = C_1 + C_2$
6. Series: $1/C_{eq} = 1/C_1 + 1/C_2$