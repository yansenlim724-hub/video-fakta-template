"""Mesin TTS Supertonic 3 (sherpa-onnx, int8) — dipakai semua video fakta.

Model dicari di urutan ini:
  1. env SUPERTONIC_MODEL_DIR
  2. tts/model/sherpa-onnx-supertonic-3-tts-int8-2026-05-11 (hasil tts/setup.sh)
  3. ~/workspace/supertonic-test/sherpa-onnx-supertonic-3-tts-int8-2026-05-11
     (instalasi lama di VM ini)

Contoh pakai:
    from tts_engine import build_tts
    tts = build_tts()
    audio = tts.generate(text="Halo dunia.", sid=9, speed=0.95)  # 9 = Seno
    # audio.samples (np.float32), audio.sample_rate (44100)
"""
import os

import sherpa_onnx

MODEL_DIRNAME = "sherpa-onnx-supertonic-3-tts-int8-2026-05-11"


def find_model_dir() -> str:
    candidates = []
    env = os.environ.get("SUPERTONIC_MODEL_DIR")
    if env:
        candidates.append(env)
    here = os.path.dirname(os.path.abspath(__file__))
    candidates.append(os.path.join(here, "model", MODEL_DIRNAME))
    candidates.append(
        os.path.join(
            os.path.expanduser("~/workspace/supertonic-test"), MODEL_DIRNAME
        )
    )
    for c in candidates:
        if os.path.isfile(os.path.join(c, "voice.bin")):
            return c
    raise FileNotFoundError(
        "Model Supertonic 3 tidak ketemu. Jalankan bash tts/setup.sh dulu, "
        "atau set env SUPERTONIC_MODEL_DIR ke folder model. Dicari di: "
        + "; ".join(candidates)
    )


def build_tts(model_dir: str | None = None):
    md = model_dir or find_model_dir()
    config = sherpa_onnx.OfflineTtsConfig(
        model=sherpa_onnx.OfflineTtsModelConfig(
            supertonic=sherpa_onnx.OfflineTtsSupertonicModelConfig(
                duration_predictor=os.path.join(md, "duration_predictor.int8.onnx"),
                text_encoder=os.path.join(md, "text_encoder.int8.onnx"),
                vector_estimator=os.path.join(md, "vector_estimator.int8.onnx"),
                vocoder=os.path.join(md, "vocoder.int8.onnx"),
                tts_json=os.path.join(md, "tts.json"),
                unicode_indexer=os.path.join(md, "unicode_indexer.bin"),
                voice_style=os.path.join(md, "voice.bin"),
            ),
            num_threads=2,
            debug=False,
        ),
        rule_fsts="",
        max_num_sentences=1,
    )
    return sherpa_onnx.OfflineTts(config)
