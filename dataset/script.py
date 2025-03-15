import numpy as np
import pandas as pd

# Fijar semilla para reproducibilidad
np.random.seed(42)

num_pacientes = 100
dias_por_paciente = 90

registros = []  # Lista para almacenar los datos generados

# 1. Generar valores base por paciente
intensidad_base = np.random.uniform(1, 9, num_pacientes)  # Nivel medio de picor por paciente
fc_base = np.random.normal(loc=70, scale=5, size=num_pacientes)  # Frecuencia cardíaca basal
q6_paciente = np.random.choice([0, 1, 2, 3, 4], size=num_pacientes, p=[0.5, 0.125, 0.125, 0.125, 0.125])  # Momento de empeoramiento del picor

# 2. Generar datos día a día para cada paciente
for pid in range(1, num_pacientes + 1):
    base_q1 = intensidad_base[pid - 1]
    base_fc = fc_base[pid - 1]
    categoria_q6 = q6_paciente[pid - 1]

    for dia in range(1, dias_por_paciente + 1):
        # q1: Intensidad del picor (0-10)
        q1 = int(round(np.random.normal(loc=base_q1, scale=2)))
        q1 = np.clip(q1, 0, 10)  # Asegurar valores dentro del rango [0, 10]

        # q2: Número total de zonas afectadas (0-16) con distribución sesgada
        if q1 == 0:
            q2 = 0
        else:
            if np.random.rand() < 0.7:  # 70% de los casos entre 1 y 4
                q2 = np.random.randint(1, 5)
            else:  # 30% de los casos entre 5 y 16 (menos frecuente)
                q2 = np.random.randint(5, 17)

        # q6: Momento en que empeora el picor (categoría fija por paciente)
        q6 = categoria_q6

        # w8: Despertares nocturnos, ahora correlacionado con q1
        if q1 == 0:
            w8 = 0
        elif q1 >= 7:
            w8 = np.random.randint(4, 8)  # Gente con picor alto tiene más despertares (4-7)
        elif q1 >= 4:
            w8 = np.random.randint(2, 5)  # Picor medio genera 2-4 despertares
        else:
            w8 = np.random.randint(0, 3)  # Picor bajo genera 0-2 despertares

        # w3: Episodios de rascado (Poisson, λ proporcional a q1)
        w3 = max(np.random.poisson(2 * q1), w8) if q1 > 0 else 0  # Asegurar que w3 ≥ w8

        # w1: Duración del picor (minutos)
        w1 = int(round((3 + 0.5 * q1 + np.random.normal(0, 1)) * w3)) if q1 > 0 else 0
        w1 = max(w1, 0)

        # w2: Velocidad del rascado (rascados/minuto)
        w2 = int(round(30 + 2 * q1 + np.random.normal(0, 5))) if q1 > 0 else 0
        w2 = max(w2, 0)

        # w4: Frecuencia cardíaca (bpm)
        w4 = int(round(base_fc + 0.5 * q1 + 0.05 * w1 + 0.1 * w2 + np.random.normal(0, 2)))
        w4 = np.clip(w4, 40, 130)

        # w5: Temperatura (°C), correlacionada con q1
        w5 = int(round(np.random.normal(22 + 1.0 * q1, 2)))
        w5 = np.clip(w5, 0, 45)

        # w6: Humedad (%), correlacionada inversamente con q1
        w6 = int(round(np.random.normal(50 - 3.0 * q1, 5)))
        w6 = np.clip(w6, 0, 100)

        # w7: Latencia del sueño (minutos) con distribución realista
        if q6 == 0:  # Picor nocturno aumenta la latencia
            w7 = int(np.random.normal(loc=30, scale=8))
        else:
            w7 = int(np.random.normal(loc=15, scale=5))

        # Asegurar valores realistas de latencia del sueño
        w7 = np.clip(w7, 10, 50)  # Rango típico de latencia: 10 a 50 min

        # q3, q4, q5: Variables entre 0 y 5, similares en una misma entrada
        if q1 > 0:
            base_q = np.random.randint(0, 6)  # Valor base común para q3, q4 y q5 entre 0 y 5
            q3 = np.clip(base_q + np.random.randint(-1, 2), 0, 5)  # Variación de -1 a +1
            q4 = np.clip(base_q + np.random.randint(-1, 2), 0, 5)
            q5 = np.clip(base_q + np.random.randint(-1, 2), 0, 5)
        else:
            q3, q4, q5 = 0, 0, 0  # Si no hay picor, estos valores deben ser 0

        # Guardar los datos del día
        registros.append({
            "patient_id": pid,
            "day": dia,
            "q1": q1,
            "q2": q2,
            "q3": q3,
            "q4": q4,
            "q5": q5,
            "q6": q6,
            "w1": w1,
            "w2": w2,
            "w3": w3,
            "w4": w4,
            "w5": w5,
            "w6": w6,
            "w7": w7,
            "w8": w8
        })

# 3. Crear DataFrame y guardar a CSV
df = pd.DataFrame(registros)
df.to_csv("dataset_picor.csv", index=False)

print("Dataset generado y guardado como 'dataset_picor.csv'.")

